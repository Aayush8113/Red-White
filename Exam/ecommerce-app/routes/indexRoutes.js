const { Router } = require('express');
const { checkUser } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const Category = require('../models/Category');

const router = Router();

router.use(checkUser);

router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        const categories = await Category.find();
        res.render('productList', { products, categories });
    } catch (err) {
        res.status(500).send('Error loading homepage');
    }
});

router.get('/cart', (req, res) => {
    res.render('cart');
});

module.exports = router;
