export interface AIMessage {
  role: string;
  content: string;
}

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

function openAiChat(messages: AIMessage[], temperature = 0.7): Promise<string> {
  const baseUrl = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    return Promise.reject(new Error('AI_API_KEY non configurato (variabile d\'ambiente mancante)'));
  }

  return fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model, messages, stream: false, temperature })
  }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI provider error (${res.status}): ${text.slice(0, 300)}`);
    }
    const data = (await res.json()) as ChatCompletionResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI provider returned an empty response');
    return content;
  });
}

function ollamaUrl(messages: AIMessage[]): Promise<string> {
  const baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3';

  return fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false })
  }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI service unavailable (${res.status}): ${text.slice(0, 300)}`);
    }
    const data = await res.json();
    return (data.message?.content as string) || '';
  });
}

export function aiChat(messages: AIMessage[]): Promise<string> {
  const provider = process.env.AI_PROVIDER || 'ollama';
  if (provider === 'ollama') return ollamaUrl(messages);
  return openAiChat(messages);
}

export function extractJson(content: string): unknown {
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Invalid response format from AI');
  return JSON.parse(match[0]);
}
