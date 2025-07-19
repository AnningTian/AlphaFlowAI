const express = require('express');
const cors = require('cors');
require('dotenv').config();

const tradingRoutes = require('./routes/trading');
const newsRoutes = require('./routes/news');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/trading', tradingRoutes);
app.use('/api/news', newsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Trading Dashboard Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Trading Dashboard Backend running on port', PORT);
  console.log('📊 API available at http://localhost:' + PORT + '/api');
  console.log('💡 Ready to serve trading dashboard data');
}); 