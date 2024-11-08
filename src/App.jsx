// ... Rest des Codes bleibt gleich ...

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
        history: messages.slice(1) // Exclude the initial system message
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

// ... Rest des Codes bleibt gleich ...