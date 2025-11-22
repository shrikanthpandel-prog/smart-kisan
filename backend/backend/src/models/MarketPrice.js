const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, default: 'per quintal' },
  date: { type: Date, default: Date.now },
  source: { type: String } // e.g., 'government', 'market', 'manual'
});

// Index for faster queries
marketPriceSchema.index({ cropName: 1, location: 1, date: -1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
