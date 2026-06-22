const { Router } = require('express');
const productController = require('../controllers/productController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/', productController.product_list_get);
router.get('/my-products', requireAuth, productController.my_products_get);
router.get('/create', requireAuth, productController.product_create_get);
router.post('/create', requireAuth, productController.product_create_post);
router.get('/:id', productController.product_item_get);
router.post('/delete/:id', requireAuth, productController.product_delete);

module.exports = router;
