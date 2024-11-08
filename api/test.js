module.exports = (req, res) => {
  console.log('API route hit:', req.url);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    return res.status(200).json({
      message: "Test API is working",
      timestamp: new Date().toISOString(),
      url: req.url
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
};