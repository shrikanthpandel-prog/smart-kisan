const mongoose = require('mongoose');

const moneySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  note: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Money', moneySchema);