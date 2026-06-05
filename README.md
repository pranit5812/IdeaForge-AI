# IdeaForge AI — Startup-Grade Intelligent Project Planner & Preparation Suite

IdeaForge AI is an advanced, production-level, full-stack AI-powered platform designed to empower students to build high-impact, original project portfolios. The system helps students transition from a vague initial spark of an idea to a fully planned, architected, and defense-ready project.

Powered by **Google Gemini AI**, **FastAPI**, **React.js**, and **MongoDB**, IdeaForge AI generates premium project descriptions, visual SVGs of software architecture flows, robust roadmaps, dataset suggestions, and interactive viva-voce examination preparation cards.

---

## 🚀 Core Features

- **Domain-Aware AI Generator**: Automatically configures detailed project scopes including problem statements, roadmap timelines, features, tech stacks, and dataset suggestions based on domains and skills.
- **Originality Scanner & Interceptor**: Scans proposed project titles and scopes for overused or boilerplate templates (e.g., "attendance tracker", "to-do list"). If an overused template is detected, the engine applies score penalties, alerts the student, and outputs advice to pivot the concept into a highly unique design.
- **Interactive SVG Architecture Builder**: Renders interactive, animated flowcharts mapping the flow from the client React UI, through the FastAPI controllers and security tokens, to MongoDB collection indexes.
- **Viva Prep Simulator & Copy Engine**: Supplies an exhaustive bank of Technical, HR/Team, DB, and Deployment questions complete with expert-level answers. Students can regenerate specific viva categories or copy questions to their clipboard instantly.
- **On-the-Fly PDF Report Compiler**: Generates a stylized, beautifully formatted PDF report of the entire project plan using pure Python `reportlab` dynamically streaming back to the client. No system binary dependencies (like `wkhtmltopdf`) are required!
- **Saved Projects Library**: Keeps a persistent log of all planned projects, searchable with responsive search queries and domain-type tags.

---

## 🛠️ Technology Stack

### Frontend
- **React.js (Vite)**: Fast SPA hot-reloading pipeline.
- **Tailwind CSS**: Sleek, glassmorphic styling utilizing custom radial spotlights and deep space colors (`slate-950`).
- **Framer Motion**: Fluid, spring-loaded page entries, tab transitions, and animated dashboard widgets.
- **Axios**: Promised-based HTTP requests with dynamic bearer token interception.

### Backend
- **FastAPI (Python)**: High-performance asynchronous REST API server.
- **Pydantic v2**: Strict payload and JSON data validation.
- **ReportLab**: Dynamic, programmatically drawn PDF generation stream.
- **Python-Jose & Passlib**: Secure password hashing (`bcrypt`) and JWT authorization.

### Database & AI
- **MongoDB Atlas**: Document storage for users and saved projects.
- **Google Gemini API**: Dynamic project analysis and structured response generation (`gemini-1.5-flash`).

---

## 📂 Project Structure

```
d:/Project/
├── backend/
│   ├── app/
│   │   ├── database/        # MongoDB connection pools
│   │   ├── models/          # User and Project Pydantic schemas
│   │   ├── routes/          # Auth & Project router controllers
│   │   ├── services/        # Gemini AI & Originality scoring engines
│   │   ├── utils/           # JWT security & cryptography
│   │   └── main.py          # FastAPI server entrance
│   ├── tests/               # Backend validation scripts
│   ├── .env.example         # Template environment configuration
│   └── requirements.txt     # Python backend dependencies
└── frontend/
    ├── src/
    │   ├── components/      # Glassmorphic cards, CircleProgress, Layouts
    │   ├── context/         # React Auth context manager
    │   ├── pages/           # Pages (Landing, Dashboard, Form, Result, Saved)
    │   ├── services/        # API networking hooks
    │   ├── App.jsx          # Route guards & Router Setup
    │   └── main.jsx         # React DOM Mounting
    ├── index.html           # Main HTML shell
    ├── tailwind.config.js   # Tailored color system and grids
    └── package.json         # Node.js dependencies
```

---

## ⚙️ Local Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10.0 or higher
- **MongoDB**: A running local MongoDB instance or a MongoDB Atlas cloud URI.

---

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:
```powershell
# Windows PowerShell
python -m venv .venv
.venv\Scripts\Activate.ps1

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

Install python dependencies:
```bash
pip install -r requirements.txt
```

Create your `.env` configuration file:
Copy the template file `.env.example` to `.env`.
```bash
copy .env.example .env
```

Ensure your `.env` contains:
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ideaforge
JWT_SECRET=your_super_secret_jwt_random_key_here
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

> [!TIP]
> **Simulated Fallback Mode**: If you do not have a Gemini API Key or a MongoDB connection, the app will run seamlessly! The database defaults to a local instance (`mongodb://localhost:27017/ideaforge`), and the Gemini service includes a comprehensive **domain-aware offline mockup generator** that supplies realistic, high-fidelity startup project data instantly.

Start the FastAPI backend server:
```bash
uvicorn app.main:app --reload
```
The backend will run on **`http://localhost:8000`**. You can view interactive Swagger docs at `http://localhost:8000/docs`.

---

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd ../frontend
```

Install npm packages:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend will run on **`http://localhost:5173`**.

---

## 🧪 Running Integration Tests

To run the automated suite that checks simulated generator compliance with Pydantic constraint limits:

Ensure your virtual environment is active in the `backend` folder, then run:
```bash
python -m unittest tests/test_ai_parser.py
```

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)
The frontend is fully configured for zero-setup deployments on **Vercel**:
1. Connect your Github repository to Vercel.
2. Select the `frontend` folder as the root directory.
3. Configure the Framework Preset to **Vite**.
4. Set Environment Variables:
   - `VITE_API_URL` = `https://your-backend-render-url.onrender.com`
5. Click **Deploy**.

### Backend Deployment (Render)
To deploy the FastAPI server to **Render**:
1. Create a new **Web Service** on Render and link your Github repository.
2. Select the Environment to **Python**.
3. Set the Root Directory to `backend`.
4. Configure the Build Command: `pip install -r requirements.txt`
5. Configure the Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Under Environment Variables, add:
   - `MONGODB_URI` = `mongodb+srv://...`
   - `JWT_SECRET` = `your_jwt_secret`
   - `GEMINI_API_KEY` = `your_gemini_api_key`
7. Click **Deploy**.

---

## 🎨 Premium Visual Elements

The frontend is custom-tailored with premium SaaS design parameters:
- **Dark Mode Backdrop**: Complete `slate-950` night sky gradient background with multiple floating glowing blobs.
- **Glassmorphism Overlay**: Components leverage `bg-slate-900/60 backdrop-blur-xl border border-slate-800` styling.
- **Spring Animations**: Framer Motion powers smooth sliding content tabs, checklist completions, and fading widgets.
- **Originality Gauges**: Circular SVG animated meters showing Innovation, Commonness, and Trend indicators in real time.
