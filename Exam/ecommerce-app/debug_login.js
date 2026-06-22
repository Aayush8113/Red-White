require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const user = await User.findOne({ email: 'admin@evostore.com' });
        console.log('User found:', user ? user.email : 'No user');
        if (user) {
            const auth = await user.matchPassword('password123');
            console.log('Password match:', auth);
        }
        process.exit();
    })
    .catch(err => console.error(err));
