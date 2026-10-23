// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Authentication token required.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'd8rewsBq9dpCwnqRbcVlHP6W7byiqp8Re14H/dx+ByCAHo8h2rqH80UqxqBPAxSP', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.'
      });
    }

    req.user = user;
    next();
  });
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    const userRole = (req.user.role || '').toUpperCase();
    const formattedRoles = allowedRoles.map(r => r.toUpperCase());

    if (!formattedRoles.includes(userRole) && userRole !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires one of [${allowedRoles.join(', ')}] permissions.`
      });
    }

    next();
  };
};

module.exports = { authenticateToken, requireRole };
