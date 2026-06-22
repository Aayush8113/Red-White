const { Router } = require('express');
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/checkout', requireAuth, orderController.checkout_get);
router.post('/place-order', requireAuth, orderController.place_order_post);
router.get('/receipt/:id', requireAuth, orderController.receipt_get);

module.exports = router;
