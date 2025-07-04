const OpenAI = require('openai');
require('dotenv').config();

let openai = null;

// Only initialize OpenAI if API key is available
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

async function chatWithAI(messages) {
  if (!openai) {
    throw new Error('OpenAI API key is not configured');
  }
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
  });
  return response.choices[0].message.content;
}

module.exports = { chatWithAI }; 