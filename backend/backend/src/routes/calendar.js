const express = require('express');
const router = express.Router();
const CropCalendar = require('../models/CropCalendar');

// Middleware to verify JWT token
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No authentication token' });
    }
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper function to generate reminders
function generateReminders(crop, plantingDate, harvestDate) {
  const reminders = [];
  const planting = new Date(plantingDate);
  
  // Planting reminder (1 day before)
  const plantingReminder = new Date(planting);
  plantingReminder.setDate(plantingReminder.getDate() - 1);
  reminders.push({
    type: 'planting',
    date: plantingReminder,
    message: `Prepare for ${crop} planting tomorrow`
  });
  
  // Irrigation reminders (every 7 days)
  for (let i = 7; i < 90; i += 7) {
    const irrigationDate = new Date(planting);
    irrigationDate.setDate(irrigationDate.getDate() + i);
    if (irrigationDate < new Date(harvestDate)) {
      reminders.push({
        type: 'irrigation',
        date: irrigationDate,
        message: `Time to irrigate ${crop} crops`
      });
    }
  }
  
  // Fertilizer reminders (30, 60 days)
  [30, 60].forEach(days => {
    const fertilizerDate = new Date(planting);
    fertilizerDate.setDate(fertilizerDate.getDate() + days);
    if (fertilizerDate < new Date(harvestDate)) {
      reminders.push({
        type: 'fertilizer',
        date: fertilizerDate,
        message: `Apply fertilizer to ${crop} crops`
      });
    }
  });
  
  // Harvest reminder (3 days before)
  const harvestReminder = new Date(harvestDate);
  harvestReminder.setDate(harvestReminder.getDate() - 3);
  reminders.push({
    type: 'harvest',
    date: harvestReminder,
    message: `${crop} harvest approaching in 3 days`
  });
  
  return reminders;
}

// POST /api/calendar - Create crop calendar
router.post('/', auth, async (req, res) => {
  try {
    const { crop, plantingDate, harvestDate, location } = req.body;
    
    // Auto-generate reminders based on crop type
    const reminders = generateReminders(crop, plantingDate, harvestDate);
    
    const calendar = new CropCalendar({
      user: req.user.id,
      crop,
      plantingDate,
      harvestDate,
      location,
      reminders
    });
    
    await calendar.save();
    res.status(201).json(calendar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/calendar - Get user's calendars
router.get('/', auth, async (req, res) => {
  try {
    const calendars = await CropCalendar.find({ user: req.user.id })
      .sort({ plantingDate: -1 });
    res.json(calendars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/calendar/upcoming - Get upcoming reminders
router.get('/upcoming', auth, async (req, res) => {
  try {
    const calendars = await CropCalendar.find({ 
      user: req.user.id,
      status: { $ne: 'harvested' }
    });
    
    const upcomingReminders = [];
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    calendars.forEach(calendar => {
      calendar.reminders.forEach(reminder => {
        if (!reminder.completed && reminder.date >= today && reminder.date <= nextWeek) {
          upcomingReminders.push({
            ...reminder.toObject(),
            crop: calendar.crop,
            calendarId: calendar._id
          });
        }
      });
    });
    
    res.json(upcomingReminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/calendar/:id/reminder/:reminderId - Mark reminder as completed
router.patch('/:id/reminder/:reminderId', auth, async (req, res) => {
  try {
    const calendar = await CropCalendar.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!calendar) {
      return res.status(404).json({ error: 'Calendar not found' });
    }
    
    const reminder = calendar.reminders.id(req.params.reminderId);
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    reminder.completed = req.body.completed;
    await calendar.save();
    
    res.json(calendar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/calendar/:id/status - Update calendar status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const calendar = await CropCalendar.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: req.body.status },
      { new: true }
    );
    
    if (!calendar) {
      return res.status(404).json({ error: 'Calendar not found' });
    }
    
    res.json(calendar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
