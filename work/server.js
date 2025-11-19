const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'focal'
});

connection.connect(function(err) {
  if (err) {
    console.error('Connection error:', err.stack);
    return;
  }
  console.log('MySQL connected! Thread ID:', connection.threadId);
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Focal API!');
});

// Get all users (for testing)
app.get('/inserted', (req, res) => {
  connection.query('SELECT * FROM users', function(err, results) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// Registration
app.post('/users', (req, res) => {
  console.log('Received registration body:', req.body);

  const { username, password, email, phone } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password and email are required' });
  }

  // Check existing account
  const checkSql = 'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1';
  connection.query(checkSql, [username, email], (err, rows) => {
    if (err) {
      console.error('MySQL Select Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (rows.length > 0) {
      return res.status(409).json({ message: 'Account already exists. Please login.' });
    }

    // Insert
    const insertSql = 'INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)';
    connection.query(insertSql, [username, password, email, phone], (insertErr) => {
      if (insertErr) {
        console.error('MySQL Insert Error:', insertErr);
        return res.status(500).json({ message: 'Error inserting user' });
      }
      res.json({ message: 'User registered successfully!' });
    });
  });
});

// Login (username or email)
app.post('/login', (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password required' });
  }

  console.log('Login attempt:', identifier);

  const findSql = 'SELECT id, username, email, password FROM users WHERE username = ? OR email = ? LIMIT 1';
  connection.query(findSql, [identifier, identifier], (err, rows) => {
    if (err) {
      console.error('MySQL Select Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Account not found. Please register.' });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({
      message: 'Login successful!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });
});

// Start server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
