require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Stripe = require('stripe');
const User = require('./models/User');
const Habit = require('./models/Habit');
const Plan = require('./models/Plan');

// Initialize Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Debug: Log MongoDB URI
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'loaded' : 'NOT LOADED');

const app = express();

// Increase JSON limit if needed
app.use(express.json({ limit: '1mb' }));

// CORS - allow all origins in development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Content Security Policy headers - more permissive for dev
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval'; connect-src * http://localhost:* ws://localhost:*; img-src * data: https:;");
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting/disconnected',
    readyState: mongoose.connection.readyState
  });
});

// Chat with AI - works without login too
app.post('/api/chat', async (req, res) => {
  console.log('Chat route hit!', req.body);
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for optional auth token
    let userContext = '';
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          userContext = `The user's name is ${user.username}. They have a current streak of ${user.totalScore || 0} days.`;
        }
      } catch (e) {
        console.log('Token verify failed:', e.message);
      }
    }

    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3';
    
    // Build conversation context from history
    const systemPrompt = userContext 
      ? `You are an AI assistant integrated into OmniHabit, a habit tracking and personal development platform. ${userContext} Provide motivational, concise responses about habits, productivity, neuroscience, and personal growth. Keep responses brief and actionable. Respond in Italian when the user writes in Italian.`
      : 'You are an AI assistant integrated into OmniHabit, a habit tracking and personal development platform. Provide motivational, concise responses about habits, productivity, neuroscience, and personal growth. Keep responses brief and actionable. Respond in Italian when the user writes in Italian.';
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: false })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama error:', errorText);
      return res.status(502).json({ error: 'AI service unavailable', details: errorText });
    }

    const data = await response.json();
    res.json({ response: data.message.content, role: 'assistant' });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Chat error' });
  }
});

// MongoDB connection with retry logic
const connectWithRetry = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not defined in .env file');
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Start connection
if (process.env.MONGODB_URI) {
  connectWithRetry();
} else {
  console.log('Running without MongoDB - please configure MONGODB_URI in server/.env');
}

// Middleware to protect routes
const auth = async (req, res, next) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res, next) => {
  try {
    console.log('REGISTRATION ATTEMPT:', { ...req.body, password: '***' });
    
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Tutti i campi (username, email, password) sono obbligatori.' });
    }

    if (username.length < 3) return res.status(400).json({ error: 'Username troppo breve (min 3 car.)' });
    if (password.length < 6) return res.status(400).json({ error: 'Password troppo breve (min 6 car.)' });

    // Explicit manual checks
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ error: 'Questa email è già registrata.' });
    
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Questo username è già in uso.' });

    const user = new User({ username, email, password });
    await user.save();
    
    console.log('User created:', user._id);
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { id: user._id, username: user.username, level: user.level, exp: user.exp, totalScore: user.totalScore, avatar: user.avatar }, token });
    
  } catch (error) {
    console.error('Registration error detail:', error);
    res.status(400).json({ error: error.message || 'Errore durante la registrazione' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email e password obbligatorie' });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, username: user.username, level: user.level, exp: user.exp, totalScore: user.totalScore, avatar: user.avatar }, token });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Errore durante il login' });
  }
});

// Google OAuth - Get auth URL
app.get('/api/auth/google', (req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';
  
  if (!googleClientId) {
    return res.status(500).json({ error: 'Google OAuth not configured' });
  }
  
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${googleClientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes.join(' '))}` +
    `&access_type=offline` +
    `&prompt=consent`;
  
  res.json({ authUrl });
});

// Google OAuth - Callback
app.get('/api/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    console.error('Google OAuth error:', error);
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?error=google_auth_failed&details=${error}`);
  }
  
  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?error=no_code`);
  }
  
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';
    
    console.log('Exchanging code for tokens...');
    
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: googleClientId,
      client_secret: googleClientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const { access_token } = tokenResponse.data;
    console.log('Got access token');
    
    // Get user info
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    
    const { email, name, picture } = userInfoResponse.data;
    console.log('Got user info:', email);
    
    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user with Google data
      const randomPassword = Math.random().toString(36).slice(-16);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = new User({
        username: name || email.split('@')[0],
        email,
        password: hashedPassword,
        avatar: picture,
        isGoogleAuth: true
      });
      await user.save();
    }
    
    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Redirect to frontend (assumes frontend runs on port 3000)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/?google_token=${token}&username=${encodeURIComponent(user.username)}`);
  } catch (error) {
    console.error('Google OAuth error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?error=google_auth_failed`);
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ user: { id: req.user._id, username: req.user.username, level: req.user.level, exp: req.user.exp, totalScore: req.user.totalScore, avatar: user.avatar } });
});

// Update User Stats
app.patch('/api/auth/stats', auth, async (req, res) => {
  try {
    const { level, exp, totalScore } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { level, exp, totalScore },
      { new: true }
    );
    res.json({ level: user.level, exp: user.exp, totalScore: user.totalScore });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Habit Routes
app.get('/api/habits', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/habits', auth, async (req, res) => {
  try {
    const habit = new Habit({ ...req.body, user: req.user._id });
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/habits/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!habit) return res.status(404).json();
    res.json(habit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/habits/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!habit) return res.status(404).json();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Plan Routes - CRUD for AI-generated habit plans
app.post('/api/plans', auth, async (req, res) => {
  try {
    const { title, description, planData } = req.body;
    
    if (!planData || !planData.plan) {
      return res.status(400).json({ error: 'Plan data is required' });
    }

    const plan = new Plan({
      user: req.user._id,
      title: title || 'Nuovo Piano',
      description: description || planData.summary || '',
      planData: planData
    });
    
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/plans', auth, async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/plans/:id', auth, async (req, res) => {
  try {
    const plan = await Plan.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!plan) return res.status(404).json();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/plans/:id', auth, async (req, res) => {
  try {
    const { title, description, isActive } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = Date.now();

    const plan = await Plan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );
    if (!plan) return res.status(404).json();
    res.json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/plans/:id', auth, async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!plan) return res.status(404).json();
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/plans/:id/apply', auth, async (req, res) => {
  try {
    const plan = await Plan.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    if (!plan.planData || !plan.planData.plan) {
      return res.status(400).json({ error: 'Invalid plan structure' });
    }

    // Create habits from the plan
    const createdHabits = [];
    for (const monthPlan of plan.planData.plan) {
      for (const habitName of monthPlan.habits) {
        // Check if habit already exists for this month
        const existing = await Habit.findOne({
          user: req.user._id,
          month: monthPlan.month,
          name: habitName
        });
        
        if (!existing) {
          const habit = new Habit({
            user: req.user._id,
            month: monthPlan.month,
            name: habitName,
            originPlan: plan._id
          });
          await habit.save();
          createdHabits.push(habit);
        }
      }
    }

    // Mark plan as applied and active
    plan.habitsApplied = true;
    plan.isActive = true;
    plan.updatedAt = Date.now();
    await plan.save();

    res.status(201).json({ 
      message: 'Plan applied successfully', 
      habitsCreated: createdHabits.length,
      plan
    });
  } catch (error) {
    console.error('Apply plan error:', error);
    res.status(500).json({ error: error.message || 'Failed to apply plan' });
  }
});

// Stripe Checkout Session
app.post('/api/create-checkout-session', auth, async (req, res) => {
  try {
    const { priceId, planName } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}?canceled=true`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user._id.toString(),
        planName,
        username: req.user.username,
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

// Stripe Webhook endpoint
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.metadata.userId;
        const planName = session.metadata.planName;
        console.log(`Payment successful for user ${userId}, plan: ${planName}`);
        break;
      case 'checkout.session.expired':
        console.log('Checkout session expired');
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// AI Generate Habit Plan - works without login too
app.post('/api/ai/plan', async (req, res) => {
  try {
    const { prompt, currentHabits } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3';

    const systemPrompt = `Sei un esperto di sviluppo personale e neuroscienze delle abitudini. Il tuo compito è creare un piano di abitudini mensile personalizzato per l'utente.

I mesi disponibili sono: Gennaio, Febbraio, Marzo, Aprile, Maggio, Giugno, Luglio, Agosto, Settembre, Ottobre, Novembre, Dicembre.

Restituisci SEMPRE un JSON valido con questa struttura esatta:
{
  "plan": [
    {
      "month": "Nome del mese",
      "habits": ["abitudine 1", "abitudine 2", ...]
    }
  ],
  "summary": "Breve descrizione del piano (1-2 frasi)"
}

REGOLE:
- Massimo 3 abitudini per mese
- Le abitudini devono essere specifiche, misurabili e basate sul prompt dell'utente
- Progressione logica: inizia con abitudini facili, aumenta la difficoltà
- Includi abitudini legate a: focus, salute, apprendimento, produttività
- Rispondi SOLO con JSON valido, nessun altro testo
- Se l'utente scrive in inglese, rispondi in inglese con mesi in inglese (January, February, etc.)`;

    const userPrompt = currentHabits && currentHabits.length > 0 
      ? `${prompt}\n\nAbitudini già esistenti dell'utente: ${JSON.stringify(currentHabits)}`
      : prompt;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: false })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama error:', errorText);
      return res.status(502).json({ error: 'AI service unavailable' });
    }

    const data = await response.json();
    const content = data.message.content;
    
    // Extract JSON from response
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Invalid response format from AI' });
    }

    const parsedPlan = JSON.parse(jsonMatch[0]);
    res.json(parsedPlan);
  } catch (error) {
    console.error('Plan generation error:', error);
    res.status(500).json({ error: error.message || 'Plan generation error' });
  }
});

// Final JSON fallback for any other error
app.use((err, req, res, next) => {
  console.error('Final Error Catch:', err);
  res.status(500).json({ error: 'Errore interno del server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
