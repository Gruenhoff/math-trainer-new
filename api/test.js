// api/test.js
// Statt module.exports verwenden wir die neue Export-Syntax
export default function handler(req, res) {
  return res.json({ message: 'Test endpoint working' });
}