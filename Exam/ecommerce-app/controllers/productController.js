const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports.product_list_get = async (req, res) => {
    try {
        const products = await Product.find().populate('category').populate('creator', 'username');
        res.render('productList', { products });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

module.exports.my_products_get = async (req, res) => {
    try {
        const products = await Product.find({ creator: req.user.id }).populate('category');
        res.render('myProducts', { products });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

module.exports.product_create_get = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('productForm', { categories });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

module.exports.product_create_post = async (req, res) => {
    const { title, price, description, imageUrl, category } = req.body;
    try {
        await Product.create({
            title, price, description, imageUrl, category, creator: req.user.id
        });
        res.redirect('/products/my-products');
    } catch (err) {
        console.log(err);
        res.status(400).send('Error creating product');
    }
};

module.exports.product_item_get = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category').populate('creator', 'username');
        if (!product) return res.status(404).send('Product not found');
        res.render('productItem', { product });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

module.exports.product_delete = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product.creator.toString() !== req.user.id && res.locals.user.role !== 'admin') {
            return res.status(403).send('Not authorized');
        }
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products/my-products');
    } catch (err) {
        console.log(err);
        res.status(400).send('Error deleting product');
    }
};
