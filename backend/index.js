const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin1234';

const allowedCorsOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Temporarily allow all origins until the deployment is stable.
// Restore origin restrictions in production by using CORS_ORIGIN or CORS_ORIGINS.
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// ── Passcode middleware ───────────────────────────────────────────────────────
function requirePasscode(req, res, next) {
  const passcode = req.headers['x-admin-passcode'];
  if (!passcode || passcode !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Invalid passcode' });
  }
  next();
}

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ── Admin: verify passcode ────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { passcode } = req.body;
  if (!passcode || passcode !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Invalid passcode' });
  }
  res.json({ ok: true });
});

// ── Profile (public read) ─────────────────────────────────────────────────────
app.get('/api/profile', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profile WHERE id = 1');
    if (result.rows.length === 0) return res.status(404).json({ error: 'Profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// ── Profile (admin update) ────────────────────────────────────────────────────
app.put('/api/profile', requirePasscode, async (req, res) => {
  try {
    const {
      full_name, tagline, bio, email, phone, telegram, github,
      location, degree, cgpa, university, uni_period,
      current_role, employer, work_period, languages,
      cv_url, resume_path, image_url, quick_facts,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO profile (
        id, full_name, tagline, bio, email, phone, telegram, github,
        location, degree, cgpa, university, uni_period,
        current_role, employer, work_period, languages,
        cv_url, resume_path, image_url, quick_facts
      ) VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      ON CONFLICT (id) DO UPDATE SET
        full_name=$1, tagline=$2, bio=$3, email=$4, phone=$5,
        telegram=$6, github=$7, location=$8, degree=$9, cgpa=$10,
        university=$11, uni_period=$12, current_role=$13, employer=$14,
        work_period=$15, languages=$16, cv_url=$17, resume_path=$18,
        image_url=$19, quick_facts=$20
      RETURNING *`,
      [
        full_name, tagline, bio, email, phone ?? '', telegram ?? '', github ?? '',
        location ?? '', degree ?? '', cgpa ?? '', university ?? '', uni_period ?? '',
        current_role ?? '', employer ?? '', work_period ?? '', languages ?? '',
        cv_url ?? '', resume_path ?? '', image_url ?? '',
        quick_facts ?? [],
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ── Stats (public) ────────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM settings');
    const stats = {};
    result.rows.forEach((row) => { stats[row.key] = row.value; });
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ── Stats (admin update) ──────────────────────────────────────────────────────
app.put('/api/stats', requirePasscode, async (req, res) => {
  try {
    const entries = Object.entries(req.body);
    for (const [key, value] of entries) {
      await pool.query(
        `INSERT INTO settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = $2`,
        [key, parseInt(value)]
      );
    }
    const result = await pool.query('SELECT key, value FROM settings');
    const stats = {};
    result.rows.forEach((row) => { stats[row.key] = row.value; });
    res.json(stats);
  } catch (err) {
    console.error('Error updating stats:', err);
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

// ── Projects (public) ─────────────────────────────────────────────────────────
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// ── Projects (admin update) ───────────────────────────────────────────────────
app.put('/api/projects/:id', requirePasscode, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, url, live_url, technologies } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const result = await pool.query(
      `UPDATE projects
       SET title=$1, description=$2, category=$3, url=$4, live_url=$5, technologies=$6
       WHERE id=$7 RETURNING *`,
      [title, description, category, url || null, live_url || null, technologies, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// ── Projects (admin add) ──────────────────────────────────────────────────────
app.post('/api/projects', requirePasscode, async (req, res) => {
  try {
    const { title, description, category, url, live_url, technologies } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const result = await pool.query(
      `INSERT INTO projects (title, description, category, url, live_url, technologies)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, description, category, url || null, live_url || null, technologies || []]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding project:', err);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// ── Projects (admin delete) ───────────────────────────────────────────────────
app.delete('/api/projects/:id', requirePasscode, async (req, res) => {
  try {
    await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ── Inquiries ─────────────────────────────────────────────────────────────────
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ error: 'Name, email, and message are required' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ error: 'Invalid email format' });
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

app.get('/api/inquiries', requirePasscode, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
