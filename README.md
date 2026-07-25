# Hailemariam Eyayu

A modern, dark-themed developer portfolio built with React, Vite, Tailwind CSS, Express, and PostgreSQL. This project showcases my work, skills, certificates, and contact information in a polished, responsive experience.

## Overview

This portfolio is designed to be:

- modern and visually appealing
- easy to navigate
- responsive across devices
- connected to a backend API for dynamic content

## Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS

### Backend
- Express.js
- Node.js
- PostgreSQL
- dotenv and cors

## Project Structure

`	ext
developer_portfolio/
├── backend/
│   ├── index.js
│   ├── db.js
│   └── .env
└── frontend/
    ├── src/
    └── public/
`

## Features

- Dark-themed modern UI
- Animated hero section and stats
- Filterable project cards
- Scroll-reveal animations
- Contact form connected to the backend
- Fully responsive layout

## Getting Started

### 1. Backend

`ash
cd backend
npm install
# Create a .env file and set your DATABASE_URL and PORT values
npm start
`

The backend runs on your configured local port, typically http://localhost:3002.

### 2. Frontend

`ash
cd frontend
npm install
npm run dev
`

Open http://localhost:5173 in your browser.

### 3. Build for Production

`ash
cd frontend
npm run build
`

The production build will be generated in the frontend/dist folder.

## Deploy on Vercel

### Frontend deployment

1. Push the project to GitHub.
2. Open Vercel and create a new project.
3. Import your repository.
4. Set the project root to the frontend folder.
5. Use these build settings:
   - Build Command: npm run build
   - Output Directory: dist
6. Deploy the project.

### Important note

The frontend can be deployed easily on Vercel, but the backend is a separate Node.js/Express service. For a live website, deploy the backend on a platform such as Render or Railway, then update the frontend API URL to point to that deployed backend.

## Contact

Feel free to reach out through the contact section on the portfolio site or via the repository discussion channels.
