import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import userRoutes from './routes/users.js';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Vehicle Service Booking API is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
