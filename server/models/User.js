const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Lo username è obbligatorio'], 
    unique: true, 
    trim: true,
    minlength: [3, 'Lo username deve essere di almeno 3 caratteri']
  },
  email: { 
    type: String, 
    required: [true, "L'email è obbligatoria"], 
    unique: true, 
    trim: true, 
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Inserisci un indirizzo email valido']
  },
  password: { 
    type: String, 
    default: null,
    minlength: [6, 'La password deve essere di almeno 6 caratteri']
  },
  avatar: { type: String, default: null },
  isGoogleAuth: { type: Boolean, default: false },
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Fix: Nelle versioni recenti di Mongoose, se usi async, NON devi usare next
UserSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error; // Mongoose cattura l'errore e lo passa al chiamante
  }
});

// Method to check password (works for both regular and Google users)
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
