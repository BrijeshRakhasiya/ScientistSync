const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Research = require('../models/Research');
const Comment = require('../models/Comment');

// Simple admin auth middleware using a shared secret
function adminAuth(req, res, next) {
  const headerSecret = req.header('x-admin-secret') || req.header('X-Admin-Secret');
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'ADMIN_SECRET not configured on server' });
  }
  if (!headerSecret || headerSecret !== secret) {
    return res.status(401).json({ message: 'Unauthorized: invalid admin secret' });
  }
  next();
}

// All routes below require admin
router.use(adminAuth);

// GET /api/admin/stats - basic platform statistics
router.get('/stats', async (req, res) => {
  try {
    const [users, research, comments, deletedResearch, deletedComments, admins] = await Promise.all([
      User.countDocuments({}),
      Research.countDocuments({}),
      Comment.countDocuments({}),
      Research.countDocuments({ isDeleted: true }),
      Comment.countDocuments({ isDeleted: true }),
      User.countDocuments({ role: 'admin' })
    ]);

    res.json({
      users,
      research,
      comments,
      deletedResearch,
      deletedComments,
      admins
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Users management
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username email fullName affiliation isVerified role joinDate createdAt');
    res.json(users);
  } catch (err) {
    console.error('Admin users list error:', err);
    res.status(500).json({ message: 'Failed to list users' });
  }
});

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true, fields: 'username email fullName role isVerified' }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Role updated', user: updated });
  } catch (err) {
    console.error('Admin update role error:', err);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

router.patch('/users/:id/verify', async (req, res) => {
  try {
    const { isVerified } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: !!isVerified },
      { new: true, runValidators: true, fields: 'username email fullName isVerified role' }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Verification status updated', user: updated });
  } catch (err) {
    console.error('Admin verify user error:', err);
    res.status(500).json({ message: 'Failed to update verification' });
  }
});

// Research management
router.get('/research', async (req, res) => {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    const filter = includeDeleted ? {} : { isDeleted: false };
    const items = await Research.find(filter)
      .populate('author', 'username fullName email')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Admin list research error:', err);
    res.status(500).json({ message: 'Failed to list research' });
  }
});

router.delete('/research/:id', async (req, res) => {
  try {
    const doc = await Research.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: null },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Research not found' });
    res.json({ message: 'Research soft-deleted', research: doc });
  } catch (err) {
    console.error('Admin delete research error:', err);
    res.status(500).json({ message: 'Failed to delete research' });
  }
});

router.patch('/research/:id/restore', async (req, res) => {
  try {
    const doc = await Research.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Research not found' });
    res.json({ message: 'Research restored', research: doc });
  } catch (err) {
    console.error('Admin restore research error:', err);
    res.status(500).json({ message: 'Failed to restore research' });
  }
});

// Comments management
router.get('/comments', async (req, res) => {
  try {
    const { researchId } = req.query;
    const filter = {};
    if (researchId) filter.researchId = researchId;
    const items = await Comment.find(filter)
      .populate('author', 'username fullName email')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Admin list comments error:', err);
    res.status(500).json({ message: 'Failed to list comments' });
  }
});

router.delete('/comments/:id', async (req, res) => {
  try {
    const doc = await Comment.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Comment not found' });
    res.json({ message: 'Comment soft-deleted', comment: doc });
  } catch (err) {
    console.error('Admin delete comment error:', err);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

module.exports = router;
