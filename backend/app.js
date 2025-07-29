const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); //
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const helmet = require('helmet');
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); //`helmet` is a middleware that helps secure the app by setting various HTTP headers.
app.use(cors()); //`cors` is a middleware that helps secure the app by setting various HTTP headers.
app.use(bodyParser.json()); //`bodyParser` is a middleware that helps parse the request body.
//app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://...') //replace 
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/productRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
