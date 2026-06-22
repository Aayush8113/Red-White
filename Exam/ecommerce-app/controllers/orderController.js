const Order = require('../models/Order');
const Product = require('../models/Product');

module.exports.checkout_get = (req, res) => {
    res.render('checkout');
};

module.exports.place_order_post = async (req, res) => {
    try {
        const { fullName, address, city, zipCode, paymentMethod, cartData } = req.body;
        
        const items = JSON.parse(cartData);
        if(!items || items.length === 0) return res.status(400).send('Cart is empty');

        let totalAmount = 0;
        const orderItems = [];

        for(let item of items) {
            const product = await Product.findById(item.productId);
            if(product) {
                totalAmount += product.price * item.quantity;
                orderItems.push({
                    product: product._id,
                    title: product.title,
                    price: product.price,
                    quantity: item.quantity
                });
            }
        }

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress: { fullName, address, city, zipCode },
            paymentMethod
        });

        res.json({ success: true, orderId: order._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports.receipt_get = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user');
        if(!order || order.user._id.toString() !== req.user.id) {
            return res.status(403).send('Not authorized');
        }
        res.render('receipt', { order });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};
