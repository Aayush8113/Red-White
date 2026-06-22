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

        console.log('Fetching 100+ dummy products...');
        const res = await fetch('https://dummyjson.com/products?limit=150');
        const data = await res.json();
        
        // Extract unique categories
        const categoryNames = [...new Set(data.products.map(p => p.category))];
        const categoryMap = {};

        for (let name of categoryNames) {
            // Capitalize category name
            const cleanName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const cat = await Category.create({ name: cleanName, description: `All items related to ${cleanName}` });
            categoryMap[name] = cat._id;
        }

        const productsToInsert = data.products.map(p => ({
            title: p.title,
            price: p.price,
            description: p.description.substring(0, 150),
            imageUrl: p.thumbnail,
            category: categoryMap[p.category],
            creator: admin._id
        }));

        await Product.insertMany(productsToInsert);

        console.log(`Successfully seeded ${productsToInsert.length} products across ${categoryNames.length} categories!`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
