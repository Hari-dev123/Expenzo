const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, 'test#secret'); // use same secret used in login
        req.user = decoded; // attach decoded data to req.user
        next(); // continue to the route
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
