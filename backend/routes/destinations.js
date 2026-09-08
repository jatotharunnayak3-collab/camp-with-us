const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Destination = require('../models/Destination');

// GET /api/destinations  — list all, optional filters
router.get('/', async (req, res) => {
  try {
    const { category, state, search, limit = 50, page = 1 } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (state)    query.state = new RegExp(state, 'i');

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name:  new RegExp(s, 'i') },
        { city:  new RegExp(s, 'i') },
        { state: new RegExp(s, 'i') },
        { tags:  new RegExp(s, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .sort({ rating: -1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      count: destinations.length,
      total,
      page: parseInt(page),
      destinations
    });
  } catch (err) {
    console.error('[Destinations GET]', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch destinations.' });
  }
});

// GET /api/destinations/search?q=warangal
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, message: 'Search query is required.' });
    }

    const s = q.trim();
    const destinations = await Destination.find({
      isActive: true,
      $or: [
        { name:  new RegExp(s, 'i') },
        { city:  new RegExp(s, 'i') },
        { state: new RegExp(s, 'i') },
        { tags:  new RegExp(s, 'i') }
      ]
    })
    .sort({ rating: -1 })
    .limit(20)
    .select('-__v');

    res.json({
      success: true,
      count: destinations.length,
      query: s,
      destinations
    });
  } catch (err) {
    console.error('[Destinations Search]', err.message);
    res.status(500).json({ success: false, message: 'Search failed.' });
  }
});

// GET /api/destinations/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let destination;
    if (mongoose.Types.ObjectId.isValid(id)) {
      destination = await Destination.findById(id).select('-__v');
    }
    if (!destination) {
      // Try by name (slug-friendly)
      destination = await Destination.findOne({
        name: new RegExp(`^${id.replace(/-/g, ' ')}$`, 'i'),
        isActive: true
      }).select('-__v');
    }

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    res.json({ success: true, destination });
  } catch (err) {
    console.error('[Destination GET ID]', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch destination.' });
  }
});

module.exports = router;
