const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
    try {
        // Fetch all todos and sort by newest first
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.render('todos/index', { todos });
    } catch (err) {
        console.error('Error fetching todos:', err);
        res.status(500).send('Server Error');
    }
};

exports.showAddForm = (req, res) => {
    res.render('todos/add');
};

exports.createTodo = async (req, res) => {
    try {
        const { task, description, status } = req.body;
        
        // If an image was uploaded, save the path. Otherwise, null.
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        await Todo.create({ task, description, image, status });
        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving task');
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).send('Task not found');
        
        res.render('todos/edit', { todo });
    } catch (err) {
        console.error(err);
        res.redirect('/todos');
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { task, description, status } = req.body;
        const updateData = { task, description, status };

        // Only update the image if a new file was actually uploaded
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }
        
        await Todo.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating task');
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting task');
    }
};