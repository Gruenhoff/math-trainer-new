const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const handler = async (req, res) => {
  // Log request method and URL
  console.log(`Request received: ${req.method} ${req.url}`);

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log request body
    console.log('Request body:', req.body);

    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Log OpenAI API key presence
    console.log('OpenAI API Key present:', !!process.env.OPENAI_API_KEY);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Du bist ein Mathematiklehrer, der Schülern die schriftliche Division beibringt.

          Bei "Neue Aufgaben":
          - Erstelle 2 Rechenaufgaben und 1 Textaufgabe zur schriftlichen Division
          - Zeige nur die Aufgaben
          - Füge am Ende hinzu: "Schreibe deine Lösungen in diesem Format: 'Lösungen: 1) ... 2) ... 3) ...'"

          Bei Lösungseingabe:
          - Überprüfe die Antworten
          - Bei Fehlern: Biete "Hilfe?" an
          - Bei korrekten Antworten: Lob und "Neue Aufgaben" anbieten

          Bei "Hilfe":
          - Gib einen hilfreichen Tipp zur fehlerhaft gelösten Aufgabe`
        },
        ...(history || []),
        { role: "user", content: message }
      ]
    });

    // Log successful response
    console.log('OpenAI API response received');

    return res.status(200).json({
      response: completion.choices[0].message.content
    });
  } catch (error) {
    // Enhanced error logging
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

module.exports = handler;