const mongoose = require('mongoose');

const localBusinessSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Artisan', 'Handicrafts', 'Food & Beverages', 'Tour Guide', 'Local Shop', 'Experience', 'Transport', 'Photography'],
    required: true
  },
  city: { type: String, required: true, trim: true, index: true },
  state: { type: String, required: true },
  address: { type: String },
  description: { type: String },
  products: [{ type: String }],
  contactPhone: { type: String },
  contactEmail: { type: String },
  image: { type: String, default: '' },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  priceRange: { type: String },
  openingHours: { type: String },
  rating: { type: Number, default: 4.0, min: 1, max: 5 },
  tags: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

localBusinessSchema.index({ city: 1, category: 1 });
localBusinessSchema.index({ name: 'text', description: 'text', city: 'text' });

module.exports = mongoose.model('LocalBusiness', localBusinessSchema);
