const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin1234';

// ── Email transporter ─────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendInquiryNotification({ name, email, message }) {
  if (!process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD === 'your_app_password_here') {
    console.log('[email] GMAIL_APP_PASSWORD not set — skipping email notification');
    return;
  }
  const to = [
    process.env.NOTIFY_EMAIL,
    process.env.NOTIFY_EMAIL_ALT,
  ].filter(Boolean).join(',');

  const now = new Date().toLocaleString('en-US', {
    weekday:'long', year:'numeric', month:'long', day:'numeric',
    hour:'2-digit', minute:'2-digit', timeZoneName:'short',
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to,
      replyTo: email,
      subject: `📬 New message from ${name} — Portfolio Contact`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New Inquiry</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',system-ui,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#4f46e5 0%,#3b82f6 100%);padding:32px 40px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="width:44px;height:44px;background:rgba(255,255,255,0.15);border-radius:12px;display:inline-block;text-align:center;line-height:44px;font-size:20px;vertical-align:middle;margin-right:12px">📬</div>
                <span style="color:#fff;font-size:22px;font-weight:700;vertical-align:middle">New Portfolio Inquiry</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px">

          <!-- Sender info chips -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
            <tr>
              <td style="padding:12px 16px;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.25);border-radius:10px;width:48%">
                <div style="color:#a5b4fc;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">From</div>
                <div style="color:#f1f5f9;font-size:15px;font-weight:600">${name}</div>
              </td>
              <td style="width:4%"></td>
              <td style="padding:12px 16px;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.25);border-radius:10px;width:48%">
                <div style="color:#a5b4fc;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Email</div>
                <div style="color:#60a5fa;font-size:14px;font-weight:500">${email}</div>
              </td>
            </tr>
          </table>

          <!-- Message -->
          <div style="color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px">Message</div>
          <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px 24px;color:#e2e8f0;font-size:15px;line-height:1.75;white-space:pre-wrap">${message}</div>

          <!-- CTA button -->
          <div style="margin-top:28px;text-align:center">
            <a href="mailto:${email}?subject=Re: Your Portfolio Inquiry"
               style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#4f46e5,#3b82f6);color:#fff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:0.02em">
              Reply to ${name} →
            </a>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.2)">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#475569;font-size:12px">${now}</td>
              <td align="right" style="color:#475569;font-size:12px">hailemariam-eyayu.dev</td>
            </tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
    console.log(`[email] Notification sent to ${to} for inquiry from ${name}`);
  } catch (err) {
    console.error('[email] Failed to send notification:', err.message);
  }
}

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// const allowedCorsOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '')
//   .split(',')
//   .map((origin) => origin.trim())
//   .filter(Boolean);

// Allow ALL origins — no restrictions
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-passcode'],
};
app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));
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

// ── Image upload (Cloudinary) ─────────────────────────────────────────────────
app.post('/api/upload', requirePasscode, upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: req.file.path, public_id: req.file.filename });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ── Social links (public) ─────────────────────────────────────────────────────
app.get('/api/social-links', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM social_links ORDER BY sort_order ASC, id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch social links' });
  }
});

// ── Social links (admin add) ──────────────────────────────────────────────────
app.post('/api/social-links', requirePasscode, async (req, res) => {
  try {
    const { name, icon, url } = req.body;
    if (!name?.trim() || !url?.trim()) return res.status(400).json({ error: 'Name and URL required' });
    const result = await pool.query(
      'INSERT INTO social_links (name, icon, url, sort_order) VALUES ($1,$2,$3,(SELECT COALESCE(MAX(sort_order)+1,0) FROM social_links)) RETURNING *',
      [name.trim(), icon?.trim() || '🔗', url.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add social link' });
  }
});

// ── Social links (admin update) ───────────────────────────────────────────────
app.put('/api/social-links/:id', requirePasscode, async (req, res) => {
  try {
    const { name, icon, url } = req.body;
    const result = await pool.query(
      'UPDATE social_links SET name=$1, icon=$2, url=$3 WHERE id=$4 RETURNING *',
      [name?.trim(), icon?.trim() || '🔗', url?.trim(), req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update social link' });
  }
});

// ── Social links (admin delete) ───────────────────────────────────────────────
app.delete('/api/social-links/:id', requirePasscode, async (req, res) => {
  try {
    await pool.query('DELETE FROM social_links WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete social link' });
  }
});

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
      job_title, employer, work_period, languages,
      cv_url, resume_path, image_url, quick_facts,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO profile (
        id, full_name, tagline, bio, email, phone, telegram, github,
        location, degree, cgpa, university, uni_period,
        job_title, employer, work_period, languages,
        cv_url, resume_path, image_url, quick_facts
      ) VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      ON CONFLICT (id) DO UPDATE SET
        full_name=$1, tagline=$2, bio=$3, email=$4, phone=$5,
        telegram=$6, github=$7, location=$8, degree=$9, cgpa=$10,
        university=$11, uni_period=$12, job_title=$13, employer=$14,
        work_period=$15, languages=$16, cv_url=$17, resume_path=$18,
        image_url=$19, quick_facts=$20
      RETURNING *`,
      [
        full_name, tagline, bio, email, phone ?? '', telegram ?? '', github ?? '',
        location ?? '', degree ?? '', cgpa ?? '', university ?? '', uni_period ?? '',
        job_title ?? '', employer ?? '', work_period ?? '', languages ?? '',
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

// ── Skills (public) ───────────────────────────────────────────────────────────
app.get('/api/skills', async (req, res) => {
  try {
    const cats = await pool.query('SELECT * FROM skill_categories ORDER BY sort_order ASC, id ASC');
    const skills = await pool.query('SELECT * FROM skills ORDER BY id ASC');
    const result = cats.rows.map(cat => ({
      ...cat,
      skills: skills.rows.filter(s => s.category_id === cat.id),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// ── Skill categories (admin) ──────────────────────────────────────────────────
app.post('/api/skill-categories', requirePasscode, async (req, res) => {
  try {
    const { title, icon } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title required' });
    const result = await pool.query(
      'INSERT INTO skill_categories (title, icon, sort_order) VALUES ($1,$2,(SELECT COALESCE(MAX(sort_order)+1,0) FROM skill_categories)) RETURNING *',
      [title.trim(), icon?.trim() || '🛠️']
    );
    res.status(201).json({ ...result.rows[0], skills: [] });
  } catch (err) { res.status(500).json({ error: 'Failed to add category' }); }
});

app.put('/api/skill-categories/:id', requirePasscode, async (req, res) => {
  try {
    const { title, icon } = req.body;
    const result = await pool.query(
      'UPDATE skill_categories SET title=$1, icon=$2 WHERE id=$3 RETURNING *',
      [title?.trim(), icon?.trim() || '🛠️', req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Failed to update category' }); }
});

app.delete('/api/skill-categories/:id', requirePasscode, async (req, res) => {
  try {
    await pool.query('DELETE FROM skill_categories WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Failed to delete category' }); }
});

// ── Skills within category (admin) ───────────────────────────────────────────
app.post('/api/skill-categories/:catId/skills', requirePasscode, async (req, res) => {
  try {
    const { name, level } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name required' });
    const result = await pool.query(
      'INSERT INTO skills (category_id, name, level) VALUES ($1,$2,$3) RETURNING *',
      [req.params.catId, name.trim(), parseInt(level) || 50]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Failed to add skill' }); }
});

app.put('/api/skills/:id', requirePasscode, async (req, res) => {
  try {
    const { name, level } = req.body;
    const result = await pool.query(
      'UPDATE skills SET name=$1, level=$2 WHERE id=$3 RETURNING *',
      [name?.trim(), parseInt(level) || 50, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Failed to update skill' }); }
});

app.delete('/api/skills/:id', requirePasscode, async (req, res) => {
  try {
    await pool.query('DELETE FROM skills WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Failed to delete skill' }); }
});

// ── Technologies (public) ─────────────────────────────────────────────────────
app.get('/api/technologies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM technologies ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching technologies:', err);
    res.status(500).json({ error: 'Failed to fetch technologies' });
  }
});

// ── Technologies (admin add) ──────────────────────────────────────────────────
app.post('/api/technologies', requirePasscode, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
    const result = await pool.query(
      'INSERT INTO technologies (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING *',
      [name.trim()]
    );
    if (result.rows.length === 0) return res.status(409).json({ error: 'Already exists' });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add technology' });
  }
});

// ── Technologies (admin update) ───────────────────────────────────────────────
app.put('/api/technologies/:id', requirePasscode, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
    const result = await pool.query(
      'UPDATE technologies SET name=$1 WHERE id=$2 RETURNING *',
      [name.trim(), req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update technology' });
  }
});

// ── Technologies (admin delete) ───────────────────────────────────────────────
app.delete('/api/technologies/:id', requirePasscode, async (req, res) => {
  try {
    await pool.query('DELETE FROM technologies WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete technology' });
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
    // Send email notification (non-blocking)
    sendInquiryNotification({ name, email, message });
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
