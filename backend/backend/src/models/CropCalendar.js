const mongoose = require('mongoose');

const cropCalendarSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crop: {
    type: String,
    required: true
  },
  plantingDate: {
    type: Date,
    required: true
  },
  harvestDate: {
    type: Date,
    required: true
  },
  location: String,
  reminders: [{
    type: {
      type: String,
      enum: ['planting', 'irrigation', 'fertilizer', 'pesticide', 'harvest'],
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    message: String,
    completed: {
      type: Boolean,
      default: false
    },
    notified: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['planned', 'planted', 'growing', 'harvested'],
    default: 'planned'
  }
}, { timestamps: true });

module.exports = mongoose.model('CropCalendar', cropCalendarSchema);
