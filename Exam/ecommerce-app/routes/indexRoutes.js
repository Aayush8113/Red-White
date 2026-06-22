const { Router } = require('express');
const { checkUser } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

const router = Router();

router.use(checkUser);

router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.render('productList', { products });
    } catch (err) {
        res.status(500).send('Error loading homepage');
    }
});

module.exports = router;
