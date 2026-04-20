const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        // Generate a random string so filenames never conflict
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Added a 5MB size limit to prevent users from crashing the server with massive files
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;