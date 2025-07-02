import express from 'express';
import { body, validationResult } from 'express-validator';
import Service from '../models/Service.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const { category, vehicleType } = req.query;
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (vehicleType && vehicleType !== 'both') filter.vehicleType = { $in: [vehicleType, 'both'] };

    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json({ services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create service (Admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Service name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const service = new Service(req.body);
    await service.save();

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service (Admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete service (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;