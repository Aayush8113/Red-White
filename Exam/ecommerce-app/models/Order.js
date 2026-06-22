const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        title: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        fullName: String,
        address: String,
        city: String,
        zipCode: String
    },
    paymentMethod: { type: String, default: 'COD' },
    status: { type: String, default: 'Processing' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
