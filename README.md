# 🎪 EventFlow — Event Scheduling & Management App

A full-stack event scheduling platform built with **React + Vite** (frontend), **FastAPI** (backend), and **Supabase** (database + auth). Features a stunning glassmorphism design with smooth animations.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green?logo=fastapi) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-purple?logo=supabase)

---

## ✨ Features

- 🔐 **Authentication** — Sign up / Login via Supabase Auth
- 🎫 **Event Browsing** — View upcoming events with beautiful glassmorphism cards
- 📋 **Ticket Booking** — Book tickets with real-time seat tracking
- 📧 **Email Confirmations** — Receive HTML email confirmations after booking
- 📱 **Responsive** — Fully responsive design for mobile, tablet, and desktop
- 🎨 **Glassmorphism UI** — Premium frosted-glass design with animations
- 🔍 **Search** — Filter events by name, location, or description

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Backend** | FastAPI, Python 3.11+ |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT) |
| **Email** | Python smtplib (SMTP) |

---

## 🚀 Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste the contents of `supabase/schema.sql`
3. Click **Run** to create all tables, policies, and seed data
4. Note down the following from **Project Settings → API**:
   - **Project URL** → `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - **anon (public) key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
5. Find the **JWT Secret** in **Project Settings → API → JWT Settings**:
   - Copy **JWT Secret** → `SUPABASE_JWT_SECRET`

### 2. Backend Setup

```bash
cd event-app/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate     # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example and fill in values)
copy .env.example .env
# Edit .env with your Supabase credentials and SMTP settings

# Start the server
uvicorn main:app --reload --port 8000
```

The API will be running at `http://localhost:8000`.

### 3. Frontend Setup

```bash
cd event-app/frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example and fill in values)
copy .env.example .env
# Edit .env with your Supabase URL and anon key

# Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 📁 Project Structure

```
event-app/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Glassmorphism navigation
│   │   │   ├── EventCard.jsx    # Event cards with booking
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx      # Hero + event grid
│   │   │   ├── Login.jsx        # Login form
│   │   │   ├── Signup.jsx       # Signup with password strength
│   │   │   └── MyBookings.jsx   # User's bookings
│   │   ├── supabaseClient.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css            # Glassmorphism design system
│   └── ...config files
│
├── backend/                  # FastAPI backend
│   ├── main.py              # API endpoints
│   ├── auth.py              # JWT verification
│   ├── email_service.py     # Email sending
│   └── models.py            # Pydantic models
│
└── supabase/
    └── schema.sql           # Database schema + seed data
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS) |
| `SUPABASE_JWT_SECRET` | JWT secret for token verification |
| `SMTP_HOST` | SMTP server (e.g., smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (e.g., 587) |
| `SMTP_USER` | Your email address |
| `SMTP_PASSWORD` | Your app password |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_API_URL` | Backend API URL (default: http://localhost:8000) |

---

## 📝 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Health check |
| `POST` | `/book` | Yes | Book a ticket |
| `GET` | `/my-bookings` | Yes | Get user's bookings |

---

## 📄 License

MIT
