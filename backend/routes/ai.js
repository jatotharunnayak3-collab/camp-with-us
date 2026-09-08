const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const { getHotelPreferences, askAssistant } = require('../services/geminiService');

// POST /api/ai/hotel-recommendations
// Gemini determines criteria → MongoDB finds matching hotels
router.post('/hotel-recommendations', async (req, res) => {
  try {
    const { destination, budget, travellerType, interests } = req.body;

    if (!destination || !destination.trim()) {
      return res.status(400).json({ success: false, message: 'Destination is required.' });
    }
    if (!budget || isNaN(budget)) {
      return res.status(400).json({ success: false, message: 'Budget is required.' });
    }

    // Step 1: Ask Gemini for preference criteria
    let preferences;
    try {
      preferences = await getHotelPreferences({ destination, budget, travellerType, interests });
    } catch (aiErr) {
      console.error('[AI Hotel Prefs Error]', aiErr.message);
      // Fall back to basic criteria
      preferences = { preferredTypes: ['Budget', 'Mid-Range'], mustHaveAmenities: [], maxPricePerNight: budget };
    }

    // Step 2: Query MongoDB with AI-derived criteria
    const destRegex = new RegExp(destination.trim(), 'i');
    const query = {
      isActive: true,
      $or: [{ city: destRegex }, { state: destRegex }],
      pricePerNight: { $lte: parseFloat(preferences.maxPricePerNight || budget) }
    };

    if (preferences.preferredTypes && preferences.preferredTypes.length) {
      query.type = { $in: preferences.preferredTypes.map(t => new RegExp(t, 'i')) };
    }

    let hotels = await Hotel.find(query)
      .sort({ rating: -1, pricePerNight: 1 })
      .limit(10)
      .select('-__v');

    // Fallback: if strict AI preferredTypes yields 0 hotels, relax type to still show best matched stays
    if (hotels.length === 0 && query.type) {
      delete query.type;
      hotels = await Hotel.find(query)
        .sort({ rating: -1, pricePerNight: 1 })
        .limit(10)
        .select('-__v');
    }

    res.json({
      success: true,
      destination: destination.trim(),
      preferences: {
        maxBudget: preferences.maxPricePerNight || budget,
        preferredTypes: preferences.preferredTypes || [],
        mustHaveAmenities: preferences.mustHaveAmenities || [],
        reasoning: preferences.reasoning || ''
      },
      count: hotels.length,
      hotels,
      dataLabel: 'Curated Demo Data'
    });
  } catch (err) {
    console.error('[AI Hotel Rec Error]', err.message);
    res.status(500).json({ success: false, message: 'Hotel recommendation service failed.' });
  }
});

// POST /api/ai/assistant
router.post('/assistant', async (req, res) => {
  try {
    const { question, language = 'English', destination = '' } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question is required.' });
    }

    const answer = await askAssistant({ question: question.trim(), language, destination });
    res.json({ success: true, answer, language });
  } catch (err) {
    console.error('[AI Assistant Error]', err.message);
    if (err.message.includes('GEMINI_API_KEY')) {
      return res.status(503).json({ success: false, message: 'AI assistant not configured. Please set GEMINI_API_KEY.', errorType: 'AI_NOT_CONFIGURED' });
    }
    res.status(503).json({ success: false, message: 'AI assistant unavailable. Please try again.' });
  }
});

module.exports = router;
