const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const handler = async (req, res) => {
  // Wichtig: CORS-Header setzen
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // OPTIONS request handling
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Nur POST-Anfragen erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // API Key überprüfen
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found');
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const { message, history } = req.body;

    // Request-Daten validieren
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Sending request to OpenAI with message:', message);

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

    console.log('Received response from OpenAI');

    // Erfolgreiche Antwort
    return res.status(200).json({ 
      response: completion.choices[0].message.content,
      status: 'success'
    });

  } catch (error) {
    console.error('Error in API route:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Export als Edge-Function
module.exports = handler;