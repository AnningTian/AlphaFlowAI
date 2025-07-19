export default function handler(req, res) {
  res.status(200).json({
    status: 'OK',
    message: 'Trading Dashboard Backend is running',
    timestamp: new Date().toISOString()
  });
} 