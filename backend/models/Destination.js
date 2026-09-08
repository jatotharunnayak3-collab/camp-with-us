const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  entryFee: { type: String, default: 'Free' },
  timings: { type: String }
}, { _id: false });

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  country: { type: String, default: 'India' },
  description: { type: String, required: true },
  shortDescription: { type: String },
  category: {
    type: String,
    enum: ['Heritage', 'Beach', 'Hill Station', 'Religious', 'Wildlife', 'City', 'Adventure', 'Cultural'],
    required: true
  },
  bestTimeToVisit: { type: String },
  climate: { type: String },
  language: { type: String },
  currency: { type: String, default: 'Indian Rupee (INR)' },
  image: { type: String, default: '' },
  images: [{ type: String }],
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  attractions: [attractionSchema],
  popularFor: [{ type: String }],
  travelTips: [{ type: String }],
  nearbyDestinations: [{ type: String }],
  averageBudgetPerDay: { type: Number },
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Text index for search
destinationSchema.index(
  { name: 'text', city: 'text', state: 'text', description: 'text', tags: 'text' },
  { language_override: 'none' }
);
// Case-insensitive name index
destinationSchema.index({ name: 1 });
destinationSchema.index({ city: 1 });
destinationSchema.index({ state: 1 });
destinationSchema.index({ category: 1 });

module.exports = mongoose.model('Destination', destinationSchema);
