# CivicMind — Digital Citizenship Education Platform

## Project Structure
```
civicmind-v2/
├── client/          # React frontend (deploy to Vercel)
└── server/          # Node/Express backend (deploy to Render)
```

## Local Development

### 1. Clone and install
```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

### 2. Set up environment
Copy `server/.env.example` to `server/.env` and fill in:
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — any random long string
- `CLIENT_URL` — http://localhost:5173 for dev

### 3. Seed the database
```bash
cd server && node seed.js
```
This creates 5 courses, quizzes, exams, and an admin account:
- **Admin login:** `demo@civicmind.com` / `12345678`

### 4. Run
```bash
# Terminal 1 — backend
cd server && npm run dev    # runs on :5000

# Terminal 2 — frontend
cd client && npm run dev    # runs on :5173
```

Open http://localhost:5173 — you'll see the landing page.

---

## Production Deployment

### Backend → Render
1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your repo, set **Root Directory** = `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas URI
   - `JWT_SECRET` = your secret
   - `CLIENT_URL` = your Vercel URL (add after deploying frontend)
7. Deploy — copy the Render URL (e.g. `https://civicmind-api.onrender.com`)

### Frontend → Vercel
1. Create a new project on [vercel.com](https://vercel.com)
2. Connect repo, set **Root Directory** = `client`
3. Framework: **Vite**
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
5. Deploy — copy the Vercel URL
6. Go back to Render → update `CLIENT_URL` to your Vercel URL → redeploy

---

## Default Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | demo@civicmind.com | 12345678 |
| Student | Register at /register | — |

---

## Features
- 🏠 Public landing page (no login required)
- 📚 5 courses: Safety, Ethics, Privacy, Cyberbullying, Literacy
- ✏️ Quizzes grouped by course with answer review
- 📈 Progress tracking with leaderboard rank & exam results
- 🎓 Certificate request → admin approval → print/download
- 🏆 XP leaderboard connected to progress
- 👑 Admin: course management, scheduling, cert upload, messages
- ⏻ Logout confirmation modal
