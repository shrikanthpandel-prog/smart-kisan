const mongoose = require('mongoose');

const scanHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  detectedClass: { type: String, required: true },
  confidence: { type: Number },
  treatment: { type: String },
  prevention: { type: String },
  imageUrl: { type: String }, // Optional: store image path
  scannedAt: { type: Date, default: Date.now }
});

// Index for user queries
scanHistorySchema.index({ user: 1, scannedAt: -1 });

module.exports = mongoose.model('ScanHistory', scanHistorySchema);
