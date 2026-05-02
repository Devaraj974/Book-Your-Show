const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('DEBUG: Received Token (first 20 chars):', token.substring(0, 20) + '...');
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('DEBUG: Decoded Payload:', decoded);
            
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                console.warn('DEBUG: User not found in DB for ID:', decoded.id);
                return res.status(401).json({ message: 'User not found' });
            }
            console.log('DEBUG: Auth Success for:', req.user.email);
            next();
        } catch (error) {
            console.error('DEBUG: JWT Verification Failed:', error.message);
            return res.status(401).json({ message: 'Token failed' });
        }
    }
    if (!token) {
        console.warn('DEBUG: No Authorization header or Bearer token found');
        return res.status(401).json({ message: 'No token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
