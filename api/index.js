// api/index.js
module.exports = (req, res) => {
    console.log('Root API route hit');
    res.status(200).json({ message: 'API root is working' });
  };
  