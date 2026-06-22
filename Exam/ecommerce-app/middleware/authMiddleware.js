const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.redirect('/auth/login');
            } else {
                req.user = decodedToken;
                next();
            }
        });
    } else {
        res.redirect('/auth/login');
    }
};

const requireAdmin = (req, res, next) => {
    if (res.locals.user && res.locals.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden: Admins only');
    }
};

module.exports = { checkUser, requireAuth, requireAdmin };
