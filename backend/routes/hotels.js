const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// GET /api/hotels  — list all hotels
router.get('/', async (req, res) => {
  try {
    const { city, limit = 20, page = 1 } = req.query;
    const query = { isActive: true };
    if (city) {
      const cityRegex = new RegExp(city.trim(), 'i');
      query.$or = [{ city: cityRegex }, { state: cityRegex }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .sort({ rating: -1, pricePerNight: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({ success: true, count: hotels.length, total, hotels });
  } catch (err) {
    console.error('[Hotels GET]', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch hotels.' });
  }
});

// GET /api/hotels/search?city=Warangal&budget=2000&type=Budget&rating=3
router.get('/search', async (req, res) => {
  try {
    const { city, budget, type, rating, amenities, travellerType } = req.query;

    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, message: 'City is required.' });
    }

    const cityRegex = new RegExp(city.trim(), 'i');
    const query = {
      isActive: true,
      $or: [{ city: cityRegex }, { state: cityRegex }]
    };

    if (budget) {
      query.pricePerNight = { $lte: parseFloat(budget) };
    }
    if (type) {
      query.type = new RegExp(type, 'i');
    }
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim()).filter(Boolean);
      if (amenityList.length > 0) {
        query.amenities = { $all: amenityList.map(a => new RegExp(a, 'i')) };
      }
    }
    if (travellerType) {
      query.travellerTypes = { $in: [new RegExp(travellerType, 'i')] };
    }

    const hotels = await Hotel.find(query)
      .sort({ rating: -1, pricePerNight: 1 })
      .limit(20)
      .select('-__v');

    res.json({
      success: true,
      count: hotels.length,
      city: city.trim(),
      hotels
    });
  } catch (err) {
    console.error('[Hotels Search]', err.message);
    res.status(500).json({ success: false, message: 'Hotel search failed.' });
  }
});

// GET /api/hotels/:id
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).select('-__v');
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }
    res.json({ success: true, hotel });
  } catch (err) {
    console.error('[Hotel GET ID]', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch hotel.' });
  }
});

module.exports = router;
