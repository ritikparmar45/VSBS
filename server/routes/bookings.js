import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { generateReceiptPDF } from '../utils/generateReceiptPDF.js';

const router = express.Router();

// ==============================
// GET all bookings (filtered by role)
// ==============================
router.get('/', authenticateToken, async (req, res) => {
  try {
    let filter = {};
    const { status } = req.query;

    if (status) filter.status = status;

    if (req.user.role === 'user') {
      filter.user = req.user._id;
    } else if (req.user.role === 'mechanic') {
      filter.mechanic = req.user._id;
    }

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

// ==============================
// POST: Create a new booking
// ==============================
router.post('/', authenticateToken, [
  body('service').isMongoId().withMessage('Valid service ID is required'),
  body('vehicleDetails.type').isIn(['car', 'bike']).withMessage('Vehicle type must be car or bike'),
  body('vehicleDetails.make').notEmpty().withMessage('Vehicle make is required'),
  body('vehicleDetails.model').notEmpty().withMessage('Vehicle model is required'),
  body('vehicleDetails.year').isInt({ min: 1900 }).withMessage('Valid year is required'),
  body('vehicleDetails.licensePlate').notEmpty().withMessage('License plate is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').notEmpty().withMessage('Appointment time is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { service: serviceId, vehicleDetails, appointmentDate, appointmentTime, notes } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const selectedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return res.status(400).json({ message: 'Appointment date must be in the future' });

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

    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'service', select: 'name description price duration' }
    ]);

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// PATCH: Update booking status
// ==============================
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    const validStatuses = ['pending', 'approved', 'rejected', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // USER: Can only cancel their own booking
    if (req.user.role === 'user') {
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only manage your own bookings' });
      }
      if (status !== 'cancelled') {
        return res.status(403).json({ message: 'Users can only cancel bookings' });
      }
    }

    // Admin or mechanic can update any valid status
    booking.status = status;
    await booking.save();

    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'service', select: 'name description price duration' },
      { path: 'mechanic', select: 'name email phone' }
    ]);

    res.json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// PATCH: Assign mechanic (admin only)
// ==============================
router.patch('/:id/assign-mechanic', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { mechanicId } = req.body;
    const bookingId = req.params.id;

    const mechanic = await User.findOne({ _id: mechanicId, role: 'mechanic' });
    if (!mechanic) return res.status(404).json({ message: 'Mechanic not found' });

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { mechanic: mechanicId },
      { new: true }
    ).populate([
      { path: 'user', select: 'name email phone' },
      { path: 'service', select: 'name description price duration' },
      { path: 'mechanic', select: 'name email phone' }
    ]);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Mechanic assigned successfully', booking });
  } catch (error) {
    console.error('Assign mechanic error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// GET: Single booking by ID
// ==============================
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('service', 'name description price duration')
      .populate('mechanic', 'name email phone');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const canAccess =
      req.user.role === 'admin' ||
      booking.user._id.toString() === req.user._id.toString() ||
      (booking.mechanic && booking.mechanic._id.toString() === req.user._id.toString());

    if (!canAccess) return res.status(403).json({ message: 'Access denied' });

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// POST: Generate receipt (optional if handled elsewhere)
// ==============================
router.post('/generate-receipt', async (req, res) => {
  try {
    const bookingData = req.body;

    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    const user = await User.findById(savedBooking.userId);

    await generateReceiptPDF(savedBooking, user);

    res.status(201).json({ booking: savedBooking, message: 'Booking confirmed & receipt generated!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Booking failed' });
  }
});

export default router;
