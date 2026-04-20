const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const upload = require('../middleware/upload');

router.get('/', todoController.getTodos);
router.get('/add', todoController.showAddForm);
router.post('/add', upload.single('image'), todoController.createTodo);

router.get('/edit/:id', todoController.showEditForm);
router.post('/edit/:id', upload.single('image'), todoController.updateTodo);

router.post('/delete/:id', todoController.deleteTodo);

module.exports = router;