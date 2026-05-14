const mongoose = require('mongoose');
const User = require('../models/User');

const requireSession = async (req, res, next) => {
    const sessionToken = req.cookies.auth_session;
    
    if (!sessionToken || !mongoose.Types.ObjectId.isValid(sessionToken)) {
        res.clearCookie('auth_session');
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(sessionToken);
        if (user) {
            req.user = user; 
            res.locals.user = user; 
            return next();
        }
    } catch (err) { 
        console.error("Middleware Error:", err); 
    }
    
    res.clearCookie('auth_session');
    res.redirect('/login');
};

const redirectIfAuthenticated = (req, res, next) => {
    const sessionToken = req.cookies.auth_session;
    if (sessionToken && mongoose.Types.ObjectId.isValid(sessionToken)) {
        return res.redirect('/dashboard');
    }
    next();
};

module.exports = { requireSession, redirectIfAuthenticated };