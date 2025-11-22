require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());


// Import routes
const authRoutes = require('./routes/auth');
const moneyRoutes = require('./routes/money');
const cropRoutes = require('./routes/crop');
const diseaseRoutes = require('./routes/disease');
const weedRoutes = require('./routes/weed');
const suggestionRoutes = require('./routes/suggestion');
const weatherRoutes = require('./routes/weather');
const marketRoutes = require('./routes/market');
const schemesRoutes = require('./routes/schemes');
const calendarRoutes = require('./routes/calendar');
const openaiRoutes = require('./routes/openai.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/money', moneyRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/weed', weedRoutes);
app.use('/api/suggestion', suggestionRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/openai', openaiRoutes);

app.get('/', (req, res) => {
  res.send('Farmer Backend API Running');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/farmerdb';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
