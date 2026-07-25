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

## Backend Deployment and Environment Variables

### Recommended hosting

Deploy the backend separately on one of these platforms:

- Render
- Railway
- Fly.io

### Required environment variables

Create a production environment file in the backend folder with these values:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=3002
ADMIN_PASSCODE=your_secure_admin_passcode
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Backend deployment steps

1. Push the backend folder to GitHub.
2. Create a new service on Render or Railway.
3. Connect the repository.
4. Set the root directory to the backend folder.
5. Use the start command:
   - npm start
6. Add the environment variables above in the hosting dashboard.
7. Deploy the service and copy the generated backend URL.

### Frontend update

After deployment, update the frontend to use the live backend URL instead of localhost.

Example:

```ts
const API_BASE_URL = 'https://your-backend-url.com';
```

## Contact

Feel free to reach out through the contact section on the portfolio site or via the repository discussion channels.
