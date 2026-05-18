const mongoose = require('mongoose');

const redirectSchema = new mongoose.Schema({
  oldPath: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  newPath: { 
    type: String, 
    required: true 
  },
  blogId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Blog' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Redirect', redirectSchema);
