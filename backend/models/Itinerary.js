const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  time: { type: String },
  period: { type: String, enum: ['Morning', 'Afternoon', 'Evening', 'Night'] },
  place: { type: String },
  description: { type: String },
  category: { type: String },
  estimatedCost: { type: String },
  mapLink: { type: String },
  travelNote: { type: String }
}, { _id: false });

const daySchema = new mongoose.Schema({
  day: { type: Number },
  theme: { type: String },
  activities: [activitySchema],
  estimatedDayCost: { type: String },
  notes: { type: String }
}, { _id: false });

const itinerarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  destination: { type: String, required: true },
  days: { type: Number, required: true },
  budget: { type: Number },
  travellerType: { type: String },
  foodPreference: { type: String },
  interests: [{ type: String }],
  roamingTimes: [{ type: String }],
  generatedPlan: [daySchema],
  rawAiResponse: { type: String },
  isAiGenerated: { type: Boolean, default: true },
  generatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

itinerarySchema.index({ user: 1, destination: 1 });
itinerarySchema.index({ destination: 1 });

module.exports = mongoose.model('Itinerary', itinerarySchema);
