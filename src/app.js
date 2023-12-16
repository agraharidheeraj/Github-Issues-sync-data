// app.js
const express = require('express');
const mongoose = require('mongoose');
const githubService = require('./services/githubService');
const authMiddleware = require('./middleware/authMiddleware');
const { syncIssues } = require('./controllers/syncController');
const { getAllIssues, getIssueDetail, updateIssueDetail } = require('./controllers/issueController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Sync API
app.post('/sync', async (req, res) => {
  await syncIssues();
  res.json({ message: 'Sync completed successfully' });
});

// Get all issues route
app.get('/issues', authMiddleware, getAllIssues);

// Get issue detail route
app.get('/issues/:issue_id', authMiddleware, getIssueDetail);

// Update issue detail route
app.put('/issues/:issue_id', authMiddleware, express.json(), updateIssueDetail);

// Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
