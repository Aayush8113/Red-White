const User = require('../models/User');

const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE) || 3600000;

const cookieOptions = {
    httpOnly: true,           
    sameSite: 'strict',       
    maxAge: SESSION_MAX_AGE,  
};

exports.getLogin = (req, res) => res.render('login', { error: null });
exports.getSignup = (req, res) => res.render('signup', { error: null });

exports.postSignup = async (req, res) => {
    try {
        const { username, password, fullName } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) return res.render('signup', { error: 'Username unavailable.' });

        const newUser = await User.create({ username, password, fullName });
        res.cookie('auth_session', newUser._id.toString(), cookieOptions);
        res.redirect('/dashboard');
    } catch (err) {
        res.render('signup', { error: 'Registration failed.' });
    }
};

exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && await user.comparePassword(password)) {
            res.cookie('auth_session', user._id.toString(), cookieOptions);
            res.redirect('/dashboard');
        } else {
            res.render('login', { error: 'Invalid credentials.' });
        }
    } catch (err) {
        res.render('login', { error: 'Authentication failed.' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('auth_session');
    res.redirect('/login');
};