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

// Flexible Schema for collection 'link'
const LinkSchema = new mongoose.Schema({}, { strict: false, collection: 'link' });
const Link = mongoose.model('Link', LinkSchema);

// Fetch Config Endpoint
app.get('/api/config/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const config = await Link.findOne({
      $or: [
        { channelKey: key },
        { channelKey: key.toLowerCase() }
      ]
    });

    if (!config) {
      return res.status(404).json({ success: false, message: 'Config not found' });
    }

    res.json({
      success: true,
      data: {
        channelKey: config.channelKey,
        headline: config.headline,
        photoUrl: config.photoUrl,
        buttonText: config.buttonText,
        pixelId: config.pixelId,
        telegramUrl: config.telegramUrl
      }
    });
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
