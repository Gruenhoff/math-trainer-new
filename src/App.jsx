import React, { useState } from 'react';

// Die App-Komponente definieren
function App() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Schreibe "Neue Aufgaben" um zu beginnen' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const newMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: messages.slice(1)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'API request failed');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Detailed error:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: `Fehler: ${error.message}. Bitte versuchen Sie es erneut.`
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4 mb-4 h-96 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-100 ml-auto max-w-[80%]'
                  : 'bg-gray-100 max-w-[80%]'
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Schreibe deine Nachricht..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Sendet...' : 'Senden'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Hier ist der wichtige Teil - der default export
export default App;