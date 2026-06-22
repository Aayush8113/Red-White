const User = require('../models/User');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
};

module.exports.register_get = (req, res) => {
    res.render('register');
};

module.exports.login_get = (req, res) => {
    res.render('login');
};

module.exports.register_post = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const user = await User.create({ username, email, password, role });
        const token = createToken(user._id, user.role);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error creating user');
    }
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const auth = await user.matchPassword(password);
            if (auth) {
                const token = createToken(user._id, user.role);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                return res.redirect('/');
            }
        }
        res.status(400).send('Incorrect email or password');
    } catch (err) {
        res.status(400).send('Error logging in');
    }
};

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};
