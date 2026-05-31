const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// GET /api/projects - Returns all projects ordered by id
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/stats - Returns settings as key-value object
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM settings');
    const stats = {};
    result.rows.forEach((row) => {
      stats[row.key] = row.value;
    });
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// POST /api/inquiries - Validates and inserts a new inquiry
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const result = await pool.query(
      'INSERT INTO inquiries (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating inquiry:', err);
    res.status(500).json({ error: 'Failed to create inquiry' });
  }
});

// GET /api/inquiries - Returns all inquiries ordered by created_at DESC
app.get('/api/inquiries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// PUT /api/projects/:id - Update a project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, url, live_url, technologies } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      `UPDATE projects
       SET title=$1, description=$2, category=$3, url=$4, live_url=$5, technologies=$6
       WHERE id=$7
       RETURNING *`,
      [title, description, category, url || null, live_url || null, technologies, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
