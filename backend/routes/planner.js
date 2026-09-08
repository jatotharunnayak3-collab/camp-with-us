const express = require('express');
const router = express.Router();
const { generateItinerary } = require('../services/geminiService');
const Itinerary = require('../models/Itinerary');
const Destination = require('../models/Destination');
const { optionalAuth } = require('../middleware/auth');

// POST /api/planner
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { destination, days, budget, travellerType, foodPreference, interests, roamingTimes } = req.body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!destination || !destination.trim()) {
      return res.status(400).json({ success: false, message: 'Destination is required.' });
    }
    if (!days || isNaN(days) || days < 1 || days > 14) {
      return res.status(400).json({ success: false, message: 'Days must be between 1 and 14.' });
    }
    if (!budget || isNaN(budget) || budget < 100) {
      return res.status(400).json({ success: false, message: 'Budget must be at least ₹100.' });
    }
    if (!travellerType) {
      return res.status(400).json({ success: false, message: 'Traveller type is required.' });
    }

    // ── Check destination exists in DB ───────────────────────────────────────
    const dbDest = await Destination.findOne({
      $or: [
        { name: new RegExp(`^${destination.trim()}$`, 'i') },
        { city: new RegExp(`^${destination.trim()}$`, 'i') }
      ]
    });

    // ── Generate via Gemini ──────────────────────────────────────────────────
    let plan;
    try {
      plan = await generateItinerary({
        destination: destination.trim(),
        days: parseInt(days),
        budget: parseFloat(budget),
        travellerType,
        foodPreference: foodPreference || 'Vegetarian',
        interests: Array.isArray(interests) ? interests : [interests || 'General'],
        roamingTimes: Array.isArray(roamingTimes) ? roamingTimes : [roamingTimes || 'Morning']
      });
    } catch (aiErr) {
      console.error('[Planner AI Error]', aiErr.message);
      if (aiErr.message.includes('GEMINI_API_KEY')) {
        return res.status(503).json({
          success: false,
          message: 'AI service is not configured. Please set GEMINI_API_KEY in backend/.env',
          errorType: 'AI_NOT_CONFIGURED'
        });
      }
      return res.status(503).json({
        success: false,
        message: 'AI planner is temporarily unavailable. Please try again in a moment.',
        errorType: 'AI_ERROR'
      });
    }

    // ── Save to DB if user is logged in ──────────────────────────────────────
    if (req.user) {
      try {
        await Itinerary.create({
          user: req.user._id,
          destination: destination.trim(),
          days: parseInt(days),
          budget: parseFloat(budget),
          travellerType,
          foodPreference,
          interests: Array.isArray(interests) ? interests : [interests],
          roamingTimes: Array.isArray(roamingTimes) ? roamingTimes : [roamingTimes],
          generatedPlan: plan.days,
          rawAiResponse: JSON.stringify(plan),
          isAiGenerated: true
        });
      } catch (saveErr) {
        // Non-critical: log but don't fail the request
        console.error('[Itinerary Save Error]', saveErr.message);
      }
    }

    res.json({
      success: true,
      destination: destination.trim(),
      destinationInfo: dbDest ? {
        state: dbDest.state,
        category: dbDest.category,
        bestTimeToVisit: dbDest.bestTimeToVisit,
        image: dbDest.image
      } : null,
      days: parseInt(days),
      budget: parseFloat(budget),
      travellerType,
      itinerary: plan
    });

  } catch (err) {
    console.error('[Planner Route Error]', err.message);
    res.status(500).json({ success: false, message: 'Planner service error. Please try again.' });
  }
});

module.exports = router;
