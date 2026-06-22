const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = Router();

router.get('/', requireAuth, requireAdmin, categoryController.category_list_get);
router.post('/create', requireAuth, requireAdmin, categoryController.category_create_post);
router.post('/delete/:id', requireAuth, requireAdmin, categoryController.category_delete);

module.exports = router;
