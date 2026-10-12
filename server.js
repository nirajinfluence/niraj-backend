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

// Dynamic Link Schema
const LinkSchema = new mongoose.Schema({
  channelKey: { type: String, required: true, unique: true },
  pixelId: { type: String, required: true },
  telegramUrl: { type: String, required: true },
  redirectDelay: { type: Number, default: 3 }
});

const Link = mongoose.model('Link', LinkSchema);

// Endpoint to fetch dynamic config based on key
app.get('/api/config/:key', async (req, res) => {
  try {
    const config = await Link.findOne({ channelKey: req.params.key });
    if (!config) {
      return res.status(404).json({ success: false, message: 'Config not found' });
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Tracking API is running live!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
