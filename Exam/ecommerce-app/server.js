require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', require('./routes/indexRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/categories', require('./routes/categoryRoutes'));
app.use('/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
