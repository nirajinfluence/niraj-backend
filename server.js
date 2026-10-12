const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Schema & Explicit Model pointing to 'link' collection
const LinkSchema = new mongoose.Schema({
  channelKey: { type: String, required: true, unique: true },
  headline: { type: String, default: 'Official Telegram Channel' },
  photoUrl: { type: String, default: '' },
  buttonText: { type: String, default: 'JOIN TELEGRAM NOW 🚀' },
  pixelId: { type: String, required: true },
  telegramUrl: { type: String, required: true }
});

const Link = mongoose.model('Link', LinkSchema, 'link');

// Endpoint to fetch config instantly
app.get('/api/config/:key', async (req, res) => {
  try {
    const config = await Link.findOne({ channelKey: req.params.key }).select('headline photoUrl buttonText pixelId telegramUrl channelKey -_id');
    if (!config) {
      return res.status(404).json({ success: false, message: 'Config not found' });
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.send('Tracking API is running live!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
