const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDb() {
  const client = await pool.connect();
  try {
    // Create tables
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

    // Seed projects if empty
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

    // Seed settings if empty
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

    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, initDb };
