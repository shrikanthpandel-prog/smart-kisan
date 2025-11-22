const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  location: { type: String },
  listedAt: { type: Date, default: Date.now },
  isSold: { type: Boolean, default: false }
});

module.exports = mongoose.model('Crop', cropSchema);