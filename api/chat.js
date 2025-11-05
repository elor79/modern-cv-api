const fs = require('fs');
const path = require('path');

/**
 * RAG-Powered Multilingual AI Chat API for Vercel
 */

// Load knowledge base
function loadKnowledgeBase() {
  const knowledgeBasePath = path.join(process.cwd(), 'data', 'knowledge-base.json');
  const fileContent = fs.readFileSync(knowledgeBasePath, 'utf-8');
  return JSON.parse(fileContent);
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Load knowledge base
    const knowledgeBase = loadKnowledgeBase();

    // Parse request body
    const { message, language = 'en', conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Prepare system message with knowledge base
    const systemMessage = `You are Eduard Lorenz's interactive CV assistant. You have access to Eduard's complete professional profile.

LANGUAGE: Respond in ${language.toUpperCase()} language.

KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase, null, 2)}

INSTRUCTIONS:
- Answer questions about Eduard's experience, skills, portfolio, and background
- Be professional yet conversational
- Use specific examples from the knowledge base
- If asked about something not in the knowledge base, politely say you don't have that information
- Always respond in ${language.toUpperCase()} language`;

    // Build conversation messages
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        system: systemMessage,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      return res.status(response.status).json({
        error: 'AI service error',
        details: errorText
      });
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;

    return res.status(200).json({
      response: aiResponse,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      ]
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
