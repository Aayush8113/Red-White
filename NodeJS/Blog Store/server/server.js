const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');


dotenv.config();


connectDB();

const app = express();


app.use(cors()); 
app.use(express.json()); 


app.get('/', (req, res) => {
  res.send('Blog API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/comments', require('./routes/commentRoutes')); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});