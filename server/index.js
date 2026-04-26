const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS Configuration - allow all Vercel preview URLs and main domain
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://civic-mind-8bup.vercel.app',
  'https://civic-mind.vercel.app',
  /^https:\/\/civic-mind-.*\.vercel\.app$/ // Allow all preview deployments
];

const corsOptions = {
  origin: (origin, callback) => {
    // If no origin (same-origin request), allow it
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed origin or regex pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return origin === allowed;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/exams', require('./routes/exams'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'CivicMind API running' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => { console.error('❌ MongoDB error:', err.message); process.exit(1); });
