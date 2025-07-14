import express from 'express';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// 1. Admin Dashboard Stats
router.get('/stats', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.countDocuments();
    const bookings = await Booking.countDocuments();
    const services = await Service.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingsToday = await Booking.countDocuments({ createdAt: { $gte: today } });

    res.json({ users, bookings, services, bookingsToday });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Get All Users
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. Block User
router.patch('/users/:id/block', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User blocked', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Unblock User
router.patch('/users/:id/unblock', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User unblocked', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. Delete User
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 6. Get All Bookings (Admin)
router.get('/bookings', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('service', 'name category price')
      .populate('mechanic', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 7. Update Booking Status
router.patch('/bookings/:id/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'approved', 'in-progress', 'completed', 'cancelled', 'rejected'];

  if (!allowed.includes(status.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: status.toLowerCase() },
      { new: true }
    )
    .populate('user', 'name email phone')
    .populate('service', 'name category price')
    .populate('mechanic', 'name email phone');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: `Booking marked as ${status}`, booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
