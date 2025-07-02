import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get bookings (filtered by role)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let filter = {};
    const { status } = req.query;

    if (status) filter.status = status;

    // Filter based on user role
    if (req.user.role === 'user') {
      filter.user = req.user._id;
    } else if (req.user.role === 'mechanic') {
      filter.mechanic = req.user._id;
    }
    // Admin can see all bookings (no additional filter)

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('service', 'name description price duration')
      .populate('mechanic', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking
router.post('/', authenticateToken, [
  body('service').isMongoId().withMessage('Valid service ID is required'),
  body('vehicleDetails.type').isIn(['car', 'bike']).withMessage('Vehicle type must be car or bike'),
  body('vehicleDetails.make').trim().isLength({ min: 1 }).withMessage('Vehicle make is required'),
  body('vehicleDetails.model').trim().isLength({ min: 1 }).withMessage('Vehicle model is required'),
  body('vehicleDetails.year').isInt({ min: 1900 }).withMessage('Valid year is required'),
  body('vehicleDetails.licensePlate').trim().isLength({ min: 1 }).withMessage('License plate is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').isLength({ min: 1 }).withMessage('Appointment time is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { service: serviceId, vehicleDetails, appointmentDate, appointmentTime, notes } = req.body;

    // Validate service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if appointment date is in the future
    const selectedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({ message: 'Appointment date must be in the future' });
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      service: serviceId,
      vehicleDetails,
      appointmentDate,
      appointmentTime,
      notes,
      totalAmount: service.price
    });

    await booking.save();
    
    // Populate the booking before returning
    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'service', select: 'name description price duration' }
    ]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!['pending', 'approved', 'rejected', 'in-progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    if (req.user.role === 'user' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Users can only cancel their own bookings
    if (req.user.role === 'user' && status !== 'cancelled') {
      return res.status(403).json({ message: 'Users can only cancel bookings' });
    }

    booking.status = status;
    await booking.save();

    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'service', select: 'name description price duration' },
      { path: 'mechanic', select: 'name email phone' }
    ]);

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign mechanic to booking (Admin only)
router.patch('/:id/assign-mechanic', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { mechanicId } = req.body;
    const bookingId = req.params.id;

    // Validate mechanic exists and is a mechanic
    const mechanic = await User.findOne({ _id: mechanicId, role: 'mechanic' });
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { mechanic: mechanicId },
      { new: true }
    ).populate([
      { path: 'user', select: 'name email phone' },
      { path: 'service', select: 'name description price duration' },
      { path: 'mechanic', select: 'name email phone' }
    ]);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      message: 'Mechanic assigned successfully',
      booking
    });
  } catch (error) {
    console.error('Assign mechanic error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('service', 'name description price duration')
      .populate('mechanic', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    const canAccess = req.user.role === 'admin' || 
                      booking.user._id.toString() === req.user._id.toString() ||
                      (booking.mechanic && booking.mechanic._id.toString() === req.user._id.toString());

    if (!canAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;