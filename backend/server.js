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

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  const db = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  isConnected = !!db.connections[0].readyState;
};

// Force Serverless functions to connect to DB before passing the request to the API
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Serverless DB Error:', err);
    res.status(500).json({ message: 'Database Connection Timeout. Ensure MongoDB Atlas IP is set to 0.0.0.0/0' });
  }
});

// Local Dev Listener
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch(err => {
    console.error('Local DB Error:', err);
  });
}

// Export for Vercel Serverless Functions
module.exports = app;
