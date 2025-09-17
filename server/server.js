require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 
const cors = require('cors');
const bcrypt = require('bcrypt');

const auth = require('./middleware/authMiddleware');
const User = require('./models/User');
const Score = require('./models/Score');


const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic middleware
app.use(express.json());
app.use(cors());

// User registration route
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ msg: 'Please enter all fields' });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully', user: { username: newUser.username } });

  } catch (error) {
    // Log the full error to the server console for debugging
    console.error('Registration error:', error); 
    
    // Send a generic, user-friendly error message to the client
    res.status(500).json({ msg: 'Server error occurred during registration.' });
  }
});

// User login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        // Corrected: Include the user object in the response
        res.status(200).json({ msg: 'Logged in successfully', token, user: { id: user.id, username: user.username } });
      }
    );
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});

app.post('/api/score', auth, async (req, res) => {
  try {
    const { game, time } = req.body;
    const userId = req.user.id;

    // Create and save a new score document without any additional logic
    const newScore = new Score({ userId, game, time });
    await newScore.save();

    return res.status(201).json({ msg: 'Score saved successfully!', score: newScore });

  } catch (error) {
    console.error('Score submission error:', error);
    res.status(500).json({ msg: 'Server error', error });
  }
});
// ------------------------------------------------------------------

// Protected route to get user's stats
app.get('/api/stats', auth, async (req, res) => {
  try {
    const { game } = req.query;
    const userId = req.user.id;

    if (!game) {
      return res.status(400).json({ msg: 'Please provide a game name' });
    }

    const userScores = await Score.find({ userId, game }).sort({ createdAt: 1 });
    res.status(200).json(userScores);
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ msg: 'Server error', error });
  }
});


// Corrected leaderboard route using aggregation
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { game } = req.query;

    if (!game) {
      return res.status(400).json({ msg: 'Please provide a game name' });
    }

    const leaderboard = await Score.aggregate([
      { $match: { game: game } },
      {
        $group: {
          _id: '$userId',
          averageTime: { $avg: '$time' }
        }
      },
      { $sort: { averageTime: 1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          username: '$user.username',
          averageTime: '$averageTime'
        }
      }
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ msg: 'Server error', error });
  }
});

app.delete('/api/scores/:scoreId', auth, async (req, res) => {
  try {
    const { scoreId } = req.params;
    const userId = req.user.id;

    // Use findOneAndDelete to find a specific score by its ID and the userId,
    // which prevents a user from deleting another user's scores.
    const deletedScore = await Score.findOneAndDelete({
      _id: scoreId,
      userId: userId
    });

    if (!deletedScore) {
      return res.status(404).json({ msg: 'Score not found or user not authorized.' });
    }

    res.status(200).json({ msg: 'Score deleted successfully!' });
  } catch (error) {
    console.error('Score deletion error:', error);
    res.status(500).json({ msg: 'Server error', error });
  }
});


app.post('/api/refresh-token', async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    
    // Check if user still exists
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    const payload = { user: { id: user.id } };
    const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: newToken });
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));