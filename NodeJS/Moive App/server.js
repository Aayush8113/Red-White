require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

const app = express();

const cssPath = path.resolve(__dirname, 'public', 'style.css');

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));


app.get(['/favicon.ico', '/.well-known/*'], (req, res) => res.status(204).end());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.get('/style.css', (req, res) => {
    if (fs.existsSync(cssPath)) {
        res.sendFile(cssPath);
    } else {
        res.status(404).type('text/css').send('/* ERROR: You did not put style.css in the public folder! Look at your terminal! */');
    }
});

app.use(express.static(path.resolve(__dirname, 'public')));


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Database Engine Online. MVC Engaged.'))
    .catch(err => console.error('Database connection error:', err));


app.get('/', (req, res) => res.redirect('/login'));


app.use('/', authRoutes);
app.use('/', movieRoutes);


app.use((req, res) => {
    res.status(404).send('System Error: End of Line.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Command Center running on http://localhost:${PORT}`);
});