# Trading Dashboard Backend

A simple and clean backend server for the Trading Dashboard web application.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Start the server:**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📊 API Endpoints

### Trading API (`/api/trading`)

- `GET /api/trading/symbols` - Get supported cryptocurrency symbols
- `GET /api/trading/prices` - Get sample price data
- `GET /api/trading/health` - Trading service health check

### System API

- `GET /api/health` - Server health check

## 🏗️ Project Structure

```
backend/
├── package.json          # Dependencies and scripts
├── src/
│   ├── app.js            # Main application file
│   └── routes/
│       └── trading.js    # Trading API routes
├── data/                 # Data storage (currently empty)
├── scripts/              # Utility scripts (currently empty)
└── README.md            # This file
```

## 🔧 Configuration

The backend uses minimal configuration:

- **Port**: Defaults to `5000`, can be set via `PORT` environment variable
- **CORS**: Enabled for all origins in development

## 📦 Dependencies

### Production Dependencies
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### Development Dependencies
- `nodemon` - Auto-restart during development

## 🚀 Development

### Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-restart

### Adding New Routes

1. Create a new route file in `src/routes/`
2. Define your endpoints using Express Router
3. Import and use the router in `src/app.js`

Example:
```javascript
// src/routes/example.js
const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Hello World!' });
});

module.exports = router;
```

```javascript
// src/app.js
const exampleRoutes = require('./routes/example');
app.use('/api/example', exampleRoutes);
```

## 🎯 Next Steps

This backend is designed to be simple and extensible. You can:

1. **Add database integration** - Connect to your preferred database
2. **Implement authentication** - Add user authentication and authorization
3. **Add more APIs** - Extend with additional trading or market data endpoints
4. **Add middleware** - Implement logging, rate limiting, or other middleware
5. **Add external integrations** - Connect to trading APIs or data providers

## 📝 License

MIT License 