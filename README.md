# Developer Portfolio — Hailemariam Eyayu

A modern, dark-themed developer portfolio built with **React + Vite + Tailwind CSS** (frontend) and **Express + PostgreSQL** (backend).

## Project Structure

```
developer_portfolio/
├── backend/          # Express.js API server
│   ├── index.js      # Routes: /api/projects, /api/stats, /api/inquiries
│   ├── db.js         # PostgreSQL connection + schema + seed data
│   └── .env          # DATABASE_URL, PORT
└── frontend/         # React + Vite + Tailwind CSS
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── Hero.tsx          # Typewriter effect, floating badges
    │   │   ├── StatsBar.tsx      # Animated counters
    │   │   ├── About.tsx         # Bio, education, collaborator
    │   │   ├── Skills.tsx        # Skill bars + tech badges
    │   │   ├── Projects.tsx      # Filterable project cards (from API)
    │   │   ├── Certificates.tsx  # Downloadable certificates
    │   │   ├── Contact.tsx       # Contact form (posts to API)
    │   │   └── Footer.tsx
    │   ├── api/index.ts          # API calls
    │   ├── hooks/useReveal.ts    # Scroll-reveal IntersectionObserver
    │   └── types/index.ts
    └── public/
        ├── images/               # Profile photo, collaborator photo
        └── downloads/            # CV, certificates PDFs
```

## Getting Started

### Backend

```bash
cd backend
npm install
# Set DATABASE_URL in .env
npm start
# Runs on http://localhost:3002
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Build for production

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

## Features

- 🌑 Dark-themed modern design
- ✍️ Typewriter hero with animated roles
- 📊 Animated stat counters
- 🔍 Filterable project cards (web / mobile / bot)
- 📜 Scroll-reveal animations on all sections
- 📬 Contact form wired to backend API
- 📱 Fully responsive
- ♿ Accessible (ARIA labels, semantic HTML)
