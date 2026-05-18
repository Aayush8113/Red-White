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
        const { username, password, fullName, email, directorKey } = req.body;
        
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            const field = existingUser.username === username ? 'Username' : 'Email';
            return res.render('signup', { error: `${field} already in use.` });
        }

        // Role assignment logic
        let role = 'user';
        if (directorKey && directorKey === process.env.DIRECTOR_SECRET) {
            role = 'admin';
        }

        const newUser = await User.create({ username, password, fullName, email, role });
        res.cookie('auth_session', newUser._id.toString(), cookieOptions);
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Signup Error:', err);
        res.render('signup', { error: 'Registration failed. Please try again.' });
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