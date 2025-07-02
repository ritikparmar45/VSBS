import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['maintenance', 'repair', 'inspection', 'emergency'],
    default: 'maintenance'
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['car', 'bike', 'both'],
    default: 'both'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 15
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Service', serviceSchema);