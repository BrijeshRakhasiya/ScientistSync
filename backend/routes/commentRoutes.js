const express = require('express');
const Comment = require('../models/Comment');
const router = express.Router();

// GET comments for a research: /api/comments?researchId=xxxxx
router.get('/', async (req, res) => {
  try {
    const { researchId } = req.query;
    if (!researchId) return res.status(400).json({ error: 'researchId query param required' });

    const comments = await Comment.find({ research: researchId }).sort({ createdAt: -1 }).limit(500);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST add a comment
router.post('/', async (req, res) => {
  try {
    const { researchId, author, text } = req.body;
    if (!researchId || !text) return res.status(400).json({ error: 'researchId and text required' });

    const comment = new Comment({
      research: researchId,
      author: author || 'Anonymous',
      text
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
