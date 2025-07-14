import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.put('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const userId = req.user.id;

    const updatedData = { name, email, phone, address };

    if (password && password.length >= 6) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
