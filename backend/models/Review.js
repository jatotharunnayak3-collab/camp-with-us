const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String }, // denormalized for display
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: { type: String, trim: true, maxlength: 100 },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  visitDate: { type: Date },
  travellerType: { type: String },
  isVerified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 }
}, {
  timestamps: true
});

// One review per user per destination/hotel
reviewSchema.index({ user: 1, destination: 1 }, { unique: true, sparse: true });
reviewSchema.index({ user: 1, hotel: 1 }, { unique: true, sparse: true });
reviewSchema.index({ destination: 1, rating: -1 });
reviewSchema.index({ hotel: 1, rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);
