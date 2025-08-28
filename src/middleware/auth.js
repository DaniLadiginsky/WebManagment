function authApiKey(req, res, next) {
    const expected = process.env.API_KEY;
    const given = req.header('x-api-key');
  
    if (!expected) {
      return res.status(500).json({ success: false, code: 500, error: 'API key not configured' });
    }
    if (!given || given !== expected) {
      return res.status(401).json({ success: false, code: 401, error: 'Unauthorized' });
    }
    next();
  }
  
  module.exports = { authApiKey };
  