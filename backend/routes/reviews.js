const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Destination = require('../models/Destination');
const Hotel = require('../models/Hotel');
const { protect } = require('../middleware/auth');

// GET /api/reviews?destination=ID  or  ?hotel=ID
router.get('/', async (req, res) => {
  try {
    const { destination, hotel, limit = 20, page = 1 } = req.query;
    const query = {};
    if (destination) query.destination = destination;
    if (hotel)       query.hotel = hotel;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({ success: true, count: reviews.length, total, reviews });
  } catch (err) {
    console.error('[Reviews GET]', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
});

// POST /api/reviews  (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { destinationId, hotelId, rating, title, comment, visitDate, travellerType } = req.body;

    if (!destinationId && !hotelId) {
      return res.status(400).json({ success: false, message: 'destinationId or hotelId is required.' });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }
    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Review must be at least 10 characters.' });
    }

    // Check target exists
    if (destinationId) {
      const dest = await Destination.findById(destinationId);
      if (!dest) return res.status(404).json({ success: false, message: 'Destination not found.' });
    }
    if (hotelId) {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    const reviewData = {
      user: req.user._id,
      userName: req.user.name,
      rating: parseInt(rating),
      title: title || '',
      comment: comment.trim(),
      travellerType: travellerType || ''
    };
    if (destinationId) reviewData.destination = destinationId;
    if (hotelId)       reviewData.hotel = hotelId;
    if (visitDate)     reviewData.visitDate = new Date(visitDate);

    const review = await Review.create(reviewData);

    res.status(201).json({ success: true, message: 'Review submitted successfully.', review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this place.' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(' ') });
    }
    console.error('[Reviews POST]', err.message);
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
});

module.exports = router;
