const Category = require('../models/Category');

module.exports.category_list_get = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('categoryList', { categories });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

module.exports.category_create_post = async (req, res) => {
    const { name, description } = req.body;
    try {
        await Category.create({ name, description });
        res.redirect('/categories');
    } catch (err) {
        console.log(err);
        res.status(400).send('Error creating category');
    }
};

module.exports.category_delete = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/categories');
    } catch (err) {
        console.log(err);
        res.status(400).send('Error deleting category');
    }
};
