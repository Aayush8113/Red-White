require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const seedDB = async () => {
    try {
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});

        const admin = await User.create({
            username: 'admin',
            email: 'admin@evostore.com',
            password: 'password123',
            role: 'admin'
        });

        const category1 = await Category.create({ name: 'Electronics', description: 'Gadgets and devices' });
        const category2 = await Category.create({ name: 'Fashion', description: 'Clothing and apparel' });

        await Product.create({
            title: 'Wireless Headphones',
            price: 199.99,
            description: 'High quality noise-canceling wireless headphones.',
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            category: category1._id,
            creator: admin._id
        });

        await Product.create({
            title: 'Minimalist Watch',
            price: 129.99,
            description: 'Sleek and minimalist watch for everyday wear.',
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            category: category2._id,
            creator: admin._id
        });

        console.log('Database seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
