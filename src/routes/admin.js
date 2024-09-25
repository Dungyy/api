import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js'
import { getUsers, getServiceRequests } from '../controllers/admin.js';

const router = express.Router();

// Get all users - Admin only
router.get('/users', auth, isAdmin, getUsers);

// Get all service requests - Admin only
router.get('/service-requests', auth, isAdmin, getServiceRequests);

// Promote a user to admin - Admin only
router.put('/promote/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isAdmin = true;
    await user.save();
    logger.info(`User ${user.email} promoted to admin by ${req.user.email}`);
    res.status(200).json({ msg: 'User promoted to admin', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
