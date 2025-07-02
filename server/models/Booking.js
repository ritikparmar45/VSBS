import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  vehicleDetails: {
    type: {
      type: String,
      required: true,
      enum: ['car', 'bike']
    },
    make: {
      type: String,
      required: true,
      trim: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1
    },
    licensePlate: {
      type: String,
      required: true,
      trim: true
    }
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('Booking', bookingSchema);