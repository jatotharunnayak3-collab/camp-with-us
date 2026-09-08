const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true, index: true },
  state: { type: String, required: true },
  address: { type: String },
  type: {
    type: String,
    enum: ['Budget', 'Mid-Range', 'Luxury', 'Hostel', 'Guesthouse', 'Resort', 'Homestay'],
    default: 'Budget'
  },
  pricePerNight: { type: Number, required: true },
  rating: { type: Number, default: 3.5, min: 1, max: 5 },
  reviewCount: { type: Number, default: 0 },
  description: { type: String },
  amenities: [{ type: String }],
  image: { type: String, default: '' },
  images: [{ type: String }],
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  contactPhone: { type: String },
  contactEmail: { type: String },
  website: { type: String },
  checkInTime: { type: String, default: '12:00 PM' },
  checkOutTime: { type: String, default: '11:00 AM' },
  travellerTypes: [{
    type: String,
    enum: ['Student', 'Family', 'Solo', 'Senior', 'Couple', 'Business']
  }],
  isVerified: { type: Boolean, default: false },
  dataLabel: { type: String, default: 'Curated Demo Data' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

hotelSchema.index({ city: 1, pricePerNight: 1 });
hotelSchema.index({ city: 1, rating: -1 });
hotelSchema.index({ name: 'text', city: 'text', description: 'text' });

module.exports = mongoose.model('Hotel', hotelSchema);
