import express from 'express';
import User from '../models/User.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get mechanics (for assignment)
router.get('/mechanics', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const mechanics = await User.find({ role: 'mechanic', isActive: true })
      .select('name email phone')
      .sort({ name: 1 });

    res.json({ mechanics });
  } catch (error) {
    console.error('Get mechanics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle user status (Admin only)
router.patch('/:id/toggle-status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;