// controllers/receipt.js
import path from 'path';
import fs from 'fs';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { generateReceiptPDF } from '../utils/generateReceiptPDF.js';

export const getReceipt = async (req, res, mode = 'inline') => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId).populate('service');
    const user = await User.findById(booking.user);

    if (!booking || !user) return res.status(404).json({ message: 'Not found' });

    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const filePath = path.join('receipts', `receipt_${booking._id}.pdf`);
    if (!fs.existsSync(filePath)) {
      await generateReceiptPDF(booking, user);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `${mode}; filename=receipt_${booking._id}.pdf`
    );
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error('Receipt error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
