const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Add CORS headers for cross-origin requests if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { message, history } = req.body;

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
        ...history,
        { role: "user", content: message }
      ]
    });

    res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
