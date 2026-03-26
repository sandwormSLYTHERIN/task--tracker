const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Global Error Handler
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB');
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
})
.catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Export for Vercel Serverless Functions
module.exports = app;
