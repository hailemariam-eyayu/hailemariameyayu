const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDb() {
  const client = await pool.connect();
  try {
    // ── Existing tables ───────────────────────────────────────────────────────

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        url VARCHAR(500),
        live_url VARCHAR(500),
        technologies TEXT[]
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value INTEGER NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ── Profile table (single row, id=1) ──────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY DEFAULT 1,
        full_name       VARCHAR(255) NOT NULL DEFAULT '',
        tagline         TEXT         NOT NULL DEFAULT '',
        bio             TEXT         NOT NULL DEFAULT '',
        email           VARCHAR(255) NOT NULL DEFAULT '',
        phone           VARCHAR(100)          DEFAULT '',
        telegram        VARCHAR(255)          DEFAULT '',
        github          VARCHAR(255)          DEFAULT '',
        location        VARCHAR(255)          DEFAULT '',
        degree          VARCHAR(255)          DEFAULT '',
        cgpa            VARCHAR(50)           DEFAULT '',
        university      VARCHAR(255)          DEFAULT '',
        uni_period      VARCHAR(255)          DEFAULT '',
        job_title       VARCHAR(255)          DEFAULT '',
        employer        VARCHAR(255)          DEFAULT '',
        work_period     VARCHAR(255)          DEFAULT '',
        languages       VARCHAR(255)          DEFAULT '',
        cv_url          VARCHAR(500)          DEFAULT '',
        resume_path     VARCHAR(500)          DEFAULT '',
        image_url       VARCHAR(500)          DEFAULT '',
        quick_facts     TEXT[]                DEFAULT '{}'
      )
    `);

    // ── Seed projects ─────────────────────────────────────────────────────────
    const projectCount = await client.query('SELECT COUNT(*) FROM projects');
    if (parseInt(projectCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO projects (title, description, category, url, live_url, technologies) VALUES
        (
          'Gitsawe Web App',
          'Full-stack Ethiopian Orthodox Church platform with React, Node.js, Express, and MongoDB. Features news system, book library, calendar, and automatic Telegram bot broadcasts.',
          'web',
          'https://github.com/hailemariam-eyayu/GitsaweTailwind',
          'https://gitsawe-tailwind-2019.vercel.app/',
          '{React,Node.js,MongoDB,Express,"Tailwind CSS"}'
        ),
        (
          'Ethiopian Orthodox Telegram Bots',
          'Three automated Telegram bots for daily Ethiopian Orthodox readings (Gitsawe & Sinksar) with MongoDB integration, cron scheduling, and beautiful message formatting.',
          'bot',
          'https://github.com/hailemariam-eyayu/gitsawebot',
          'https://t.me/gitsawebot',
          '{Node.js,MongoDB,"Telegram API","Cron Jobs"}'
        ),
        (
          'DMUDMS - Dormitory Management System (Next.js)',
          'Modern full-stack dormitory management system built with Next.js 15, TypeScript, and MongoDB.',
          'web',
          'https://github.com/hailemariam-eyayu/dmudms_next',
          'https://dmudms-next.vercel.app/',
          '{Next.js,TypeScript,MongoDB,NextAuth.js,"Tailwind CSS"}'
        ),
        (
          'Dormitory Management System (Laravel)',
          'Comprehensive university dormitory management system with student registration, room allocation, payment tracking.',
          'web',
          'https://github.com/EdenMelkie/dmudms',
          NULL,
          '{Laravel,PHP,MySQL,Bootstrap}'
        ),
        (
          'CV Builder Application',
          'Professional resume builder with multiple templates, real-time preview, PDF export, and responsive design.',
          'web',
          'https://github.com/hailemariam-eyayu/cv-builder',
          'https://cv-builder-hailemariam.vercel.app/',
          '{React,TypeScript,"Tailwind CSS",PDF.js}'
        ),
        (
          'Gitsawe Flutter App',
          'Native Flutter mobile app for Ethiopian Orthodox Church content with multi-platform support and offline capabilities.',
          'mobile',
          'https://github.com/hailemariam-eyayu/gitsaweflutterapk',
          'https://github.com/hailemariam-eyayu/gitsaweflutterapk/releases',
          '{Flutter,Dart,SQLite}'
        ),
        (
          'Gitsawe React Native App',
          'Bare React Native mobile app with full native control, TypeScript support, and Ethiopian Orthodox Church services.',
          'mobile',
          'https://github.com/hailemariam-eyayu/GitsaweReactNative',
          NULL,
          '{"React Native",TypeScript,AsyncStorage}'
        ),
        (
          'Gitsawe Expo App',
          'Cross-platform React Native app with Expo featuring Bahire Hasab calculator, Mahlet prayer book, Bible reader.',
          'mobile',
          'https://github.com/hailemariam-eyayu/gitsawe_expo_app',
          'https://expo.dev/@hailemariam-eyayu/gitsawe-expo-app',
          '{"React Native",Expo,TypeScript}'
        ),
        (
          'Personal Portfolio',
          'Modern responsive portfolio website built with Next.js showcasing skills, projects, and professional experience.',
          'web',
          'https://github.com/hailemariam-eyayu/portfolio',
          'https://hailemariam-eyayu.vercel.app/',
          '{Next.js,React,"Tailwind CSS",TypeScript}'
        ),
        (
          'ExpressVPN Clone',
          'High-fidelity marketing landing page clone with lead capture, dynamic stats, and email automation.',
          'web',
          'https://github.com/hailemariam-eyayu/expressvpn-clone',
          NULL,
          '{React,Vite,"Tailwind CSS",Express.js,PostgreSQL}'
        )
      `);
      console.log('Seeded projects table with 10 projects.');
    }

    // ── Seed settings ─────────────────────────────────────────────────────────
    const settingsCount = await client.query('SELECT COUNT(*) FROM settings');
    if (parseInt(settingsCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO settings (key, value) VALUES
        ('years_experience', 3),
        ('technologies_count', 15),
        ('completed_projects', 10),
        ('platforms', 4),
        ('satisfied_clients', 20)
      `);
      console.log('Seeded settings table.');
    }

    // ── Social links table ────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS social_links (
        id         SERIAL PRIMARY KEY,
        name       TEXT NOT NULL,
        icon       TEXT NOT NULL DEFAULT '🔗',
        url        TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0
      )
    `);

    const socialCount = await client.query('SELECT COUNT(*) FROM social_links');
    if (parseInt(socialCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO social_links (name, icon, url, sort_order) VALUES
        ('GitHub',   'github',   'https://github.com/hailemariam-eyayu', 0),
        ('Telegram', 'telegram', 'https://t.me/hailemariam_eyayu',       1),
        ('LinkedIn', 'linkedin', 'https://linkedin.com/in/hailemariam-eyayu', 2)
      `);
      console.log('Seeded social_links table.');
    }

    // ── Skill categories + skills tables ─────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS skill_categories (
        id       SERIAL PRIMARY KEY,
        title    TEXT    NOT NULL,
        icon     TEXT    NOT NULL DEFAULT '🛠️',
        sort_order INTEGER NOT NULL DEFAULT 0
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id          SERIAL PRIMARY KEY,
        category_id INTEGER NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
        name        TEXT    NOT NULL,
        level       INTEGER NOT NULL DEFAULT 50 CHECK(level >= 0 AND level <= 100)
      )
    `);

    // Seed skill categories if empty
    const skillCatCount = await client.query('SELECT COUNT(*) FROM skill_categories');
    if (parseInt(skillCatCount.rows[0].count) === 0) {
      const cats = [
        { title: 'Backend & APIs',     icon: '⚙️', sort_order: 0,
          skills: [['Express.js',92],['Laravel / PHP',85],['Node.js',72],['REST APIs',75]] },
        { title: 'Databases',          icon: '🗄️', sort_order: 1,
          skills: [['PostgreSQL',84],['MySQL',75],['MongoDB',65],['SQLite',70]] },
        { title: 'Frontend Web',       icon: '🌐', sort_order: 2,
          skills: [['React',76],['Next.js',70],['Tailwind CSS',78],['TypeScript',65]] },
        { title: 'Mobile Development', icon: '📱', sort_order: 3,
          skills: [['Flutter',74],['Dart',72],['React Native',30],['Expo',25]] },
      ];
      for (const cat of cats) {
        const res = await client.query(
          'INSERT INTO skill_categories (title, icon, sort_order) VALUES ($1,$2,$3) RETURNING id',
          [cat.title, cat.icon, cat.sort_order]
        );
        const catId = res.rows[0].id;
        for (const [name, level] of cat.skills) {
          await client.query(
            'INSERT INTO skills (category_id, name, level) VALUES ($1,$2,$3)',
            [catId, name, level]
          );
        }
      }
      console.log('Seeded skill_categories and skills tables.');
    }

    // ── Technologies table ────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS technologies (
        id   SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      )
    `);

    // ── Seed technologies ─────────────────────────────────────────────────────
    const techCount = await client.query('SELECT COUNT(*) FROM technologies');
    if (parseInt(techCount.rows[0].count) === 0) {
      const defaultTechs = [
        'HTML5','CSS3','JavaScript','TypeScript','React','Next.js',
        'Flutter','Dart','Laravel','PHP','Node.js','Express.js',
        'MySQL','PostgreSQL','MongoDB','SQLite','Git','Docker',
        'Tailwind CSS','Bootstrap','Figma','REST API','GraphQL','CI/CD',
      ];
      for (const name of defaultTechs) {
        await client.query('INSERT INTO technologies (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
      }
      console.log('Seeded technologies table.');
    }
    const profileCount = await client.query('SELECT COUNT(*) FROM profile');
    if (parseInt(profileCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO profile (
          id, full_name, tagline, bio, email, phone, telegram, github,
          location, degree, cgpa, university, uni_period,
          job_title, employer, work_period, languages,
          cv_url, resume_path, image_url, quick_facts
        ) VALUES (
          1,
          'Hailemariam Eyayu',
          'Passionate software engineer with 5+ years of experience building modern web and mobile applications. I turn ideas into elegant, performant products.',
          'Hello! I''m Hailemariam Eyayu, a Software Engineer and Full-Stack Developer based in Addis Ababa, Ethiopia. I hold a BSc in Software Engineering from Debre Markos University with a distinguished CGPA of 3.86. I currently work as an Online Banking Technical Officer at Enat Bank, where I bridge robust backend logic with seamless digital banking experiences. I specialize in Laravel, Flutter, and Next.js, and manage PostgreSQL, MSSQL, and MySQL databases.',
          'hailemariameyayu@gmail.com',
          '',
          'https://t.me/hailemariam_eyayu',
          'https://github.com/hailemariam-eyayu',
          'Addis Ababa, Ethiopia',
          'BSc Software Engineering',
          '3.86 / 4.0',
          'Debre Markos University',
          'June 2021 – July 2025',
          'Online Banking Technical Officer',
          'Enat Bank',
          'September 2025 – Present',
          'Amharic, English',
          'https://www.canva.com/design/DAGs2oZ685w/K_xVgJR2cBqwF32pHDof0g/edit',
          '/downloads/Hailemariam_Eyayu_Resume.pdf',
          '/images/HME.png',
          '{"💡 Clean code & best practices advocate","🌍 Open-source contributor","📱 Cross-platform mobile developer","🔧 Full-stack web engineer"}'
        )
      `);
      console.log('Seeded profile table.');
    }

    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, initDb };
