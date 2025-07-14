// routes/receipts.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getReceipt } from '../controllers/receiptController.js';

const router = express.Router();

// View receipt (inline)
router.get('/view/:bookingId', authenticateToken, async (req, res) => {
  await getReceipt(req, res, 'inline'); // Pass mode as 'inline'
});

// Download receipt (attachment)
router.get('/download/:bookingId', authenticateToken, async (req, res) => {
  await getReceipt(req, res, 'attachment'); // Pass mode as 'attachment'
});


export default router;
