const mongoose = require('mongoose');

const governmentSchemeSchema = new mongoose.Schema({
  schemeName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['subsidy', 'insurance', 'loan', 'training', 'equipment'],
    required: true
  },
  description: String,
  eligibility: [String],
  benefits: [String],
  documents: [String],
  applicationLink: String,
  state: String, // null for national schemes
  active: {
    type: Boolean,
    default: true
  },
  deadline: Date
}, { timestamps: true });

module.exports = mongoose.model('GovernmentScheme', governmentSchemeSchema);
