const express = require('express');
const router = express.Router();
const LocalBusiness = require('../models/LocalBusiness');

// GET /api/businesses?city=Warangal&category=Artisan
router.get('/', async (req, res) => {
  try {
    const { city, category, limit = 20, page = 1 } = req.query;
    const query = { isActive: true };
    if (city)     query.city = new RegExp(city.trim(), 'i');
    if (category) query.category = new RegExp(category, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await LocalBusiness.countDocuments(query);
    const businesses = await LocalBusiness.find(query)
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({ success: true, count: businesses.length, total, businesses });
  } catch (err) {
    console.error('[Businesses GET]', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch businesses.' });
  }
});

// GET /api/businesses/:id
router.get('/:id', async (req, res) => {
  try {
    const business = await LocalBusiness.findById(req.params.id).select('-__v');
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found.' });
    }
    res.json({ success: true, business });
  } catch (err) {
    console.error('[Business GET ID]', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch business.' });
  }
});

module.exports = router;
