const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: { 
        type: String, 
        required: true 
    },
    description: String,
    image: String, // Store the file path, not the actual file
    status: { 
        type: String, 
        enum: ['Pending', 'In Progress', 'Completed'], // Restrict status options
        default: 'Pending' 
    }
}, { timestamps: true }); 

module.exports = mongoose.model('Todo', todoSchema);