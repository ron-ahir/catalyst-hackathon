# 🎯 AI-Powered Talent Scouting & Engagement Agent

An AI agent that takes a Job Description as input, discovers matching candidates from a talent pool, simulates personalized outreach conversations, and delivers a ranked shortlist scored on two dimensions: **Match Score** and **Interest Score**. Every ranking decision is fully traceable — recruiters see exactly why each candidate is ranked where they are.

**Hackathon**: Deccan AI Catalyst  
 
**Live App**: https://catalyst-talent-scout-agent.lovable.app  
**API**: https://catalyst-hackathon-production.up.railway.app

---

## 🎯 Problem Statement

Recruiting is slow and manual. Recruiters spend hours sifting through profiles and chasing candidate interest. This agent automates the entire scouting pipeline:

- **Input**: Job Description (paste raw JD or fill form manually)
- **Output**: Ranked shortlist of top 5 candidates with Match Score + Interest Score
- **Process**: JD parsing → candidate evaluation → engagement simulation → traceable ranked output

---

## ✨ What Makes It Special

### 1. **Full Pool Evaluation, Focused Output**
- Agent evaluates ALL 50 candidates internally
- Returns only the TOP 5 by final score
- Every result includes skill-by-skill evidence, not just a number
- UI shows: "Showing 5 candidates selected from a pool of 50"

### 2. **Traceable Scoring**
- Click any candidate to see the full breakdown
- Match Score: skill-by-skill analysis with evidence per skill
- Interest Score: enthusiasm, timeline, and salary fit sub-scores with progress bars
- Conversation transcript: outreach message + candidate response + AI analysis
- Final score formula visible: `(Match × 0.6) + (Interest × 0.4)`

### 3. **Two Input Methods**
- **"Parse JD" tab**: paste a raw job description → Claude automatically extracts title, required skills, and experience level via `POST /api/parse-jd`
- **"Fill form" tab**: manually enter structured fields (title, description, skills, experience)

### 4. **Five Result View Modes**
- **List**: ranked card list
- **Podium**: top-3 podium highlight
- **Scatter plot**: Match vs Interest scatter visualization
- **Table / Heatmap**: score grid with heatmap colouring
- **Stack (swipe)**: swipeable card deck

### 5. **Real-Time Progress**
- Live pulsing animation with rotating status messages while Claude processes
- Client-side `setInterval` cycles through status messages independently
- Single HTTP POST returns full structured JSON when ready

### 6. **Full-Stack Deployment**
- Backend: FastAPI + Claude API on Railway
- Frontend: React + TypeScript + Tailwind + shadcn/ui on Lovable
- Backend auto-deploys on every GitHub push

---

## 🏗️ Architecture

```
catalyst-hackathon/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── data/
│       └── candidates.json
├── LICENSE
├── QUICKSTART.md
└── README.md
```

### Two-Stage Agent Pipeline

```
RECRUITER INPUT
       │
       ├─── "Parse JD" tab ──────────────────────────────┐
       │    (paste raw job description)                   │
       │                                                  ▼
       │                              ┌───────────────────────────────┐
       │                              │   Stage 1: JD Parsing         │
       │                              │   POST /api/parse-jd          │
       │                              │                               │
       │                              │   Claude extracts:            │
       │                              │   • title                     │
       │                              │   • description               │
       │                              │   • required_skills           │
       │                              │   • years_experience          │
       │                              └──────────────┬────────────────┘
       │                                             │ structured fields
       └─── "Fill form" tab ────────────────────────┘
            (manual structured entry)
                                                     │
                                                     ▼
                              ┌───────────────────────────────────────┐
                              │   Stage 2: Candidate Scouting         │
                              │   POST /api/scout                     │
                              │                                       │
                              │   FastAPI Backend (Railway)           │
                              │   1. Receive structured JD fields     │
                              │   2. Load full candidate pool (50)    │
                              │   3. Send all 50 to Claude:           │
                              │      - Evaluate all internally        │
                              │      - Score Match + Interest         │
                              │      - Simulate outreach convos       │
                              │      - Return top 5 with breakdown    │
                              │   4. Sort by final_score, return top 5│
                              └──────────────┬────────────────────────┘
                                             │ JSON response
                                             ▼
                              ┌───────────────────────────────────────┐
                              │   Lovable Frontend                    │
                              │                                       │
                              │   Five view modes:                    │
                              │   • List  • Podium  • Scatter         │
                              │   • Table/Heatmap  • Stack (swipe)    │
                              │                                       │
                              │   Click any candidate →               │
                              │   • Skill-by-skill match evidence     │
                              │   • Outreach + response conversation  │
                              │   • Interest signals + progress bars  │
                              │   • Final score formula + reasoning   │
                              └───────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Anthropic API key ([get one here](https://console.anthropic.com))

### Backend Setup

1. **Install dependencies**
```bash
   cd backend
   pip install -r requirements.txt
```

2. **Set up environment**
```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
```

3. **Run the server**
```bash
   uvicorn main:app --reload
```
   Backend runs on `http://localhost:8000`

---

## 💻 How to Use

1. **Enter Job Description** — choose your preferred method:
   - **"Parse JD" tab**: paste the raw job posting text and click "Parse" — Claude extracts all fields automatically
   - **"Fill form" tab**: enter job title, description, required skills, and years of experience manually

2. **Click "Scout Candidates"**
   - Watch live status animation while Claude evaluates all 50 candidates
   - Returns top 5 with full reasoning

3. **Review Results** — switch between five view modes:
   - **List**: ranked candidate cards
   - **Podium**: top-3 podium highlight
   - **Scatter plot**: Match Score vs Interest Score visualisation
   - **Table / Heatmap**: score grid with colour coding
   - **Stack (swipe)**: swipeable card deck for quick review

4. **Drill into any candidate**
   - See skill-by-skill match evidence, outreach conversation, interest signals, and the final score formula

---

## 📊 API Endpoints

### POST `/api/parse-jd`
Extracts structured job fields from a raw job description using Claude.

**Request Body:**
```json
{
  "raw_jd": "We are looking for a Senior Backend Engineer with 5+ years of experience in Python and FastAPI..."
}
```

**Response:** `200 OK` — JSON object
```json
{
  "title": "Senior Backend Engineer",
  "description": "Building scalable REST APIs for fintech platform",
  "required_skills": ["Python", "FastAPI", "PostgreSQL", "AWS"],
  "years_experience": 5
}
```

---

### POST `/api/scout`
Evaluates all candidates and returns a ranked shortlist as JSON.

**Request Body:**
```json
{
  "title": "Senior Backend Engineer",
  "description": "Building scalable REST APIs for fintech platform",
  "required_skills": ["Python", "FastAPI", "PostgreSQL", "AWS"],
  "years_experience": 5
}
```

**Response:** `200 OK` — JSON object
```json
{
  "job_title": "Senior Backend Engineer",
  "total_pool": 50,
  "selected": 5,
  "candidates": [ ...top 5 ranked candidates... ]
}
```

**Error responses:**
- `400` — validation error (e.g. response truncated due to too many skills)
- `500` — unexpected server error

### GET `/api/candidates`
Returns all candidates in the database.

### GET `/health`
Health check endpoint.

---

## 📐 Scoring Methodology

### Match Score (0–100)
- **+15 pts** per required skill exact match
- **+8 pts** for related/partial skill match
- Skill points capped at **70**
- **+10 pts** if candidate experience ≥ required years
- **−10 pts** if candidate experience significantly below requirement

### Interest Score (0–100)
- **Base: 50 pts**
- **+20 pts** availability "Immediate"
- **+10 pts** availability "2 weeks notice"
- **+5 pts** availability "3 weeks notice"
- **+up to 20 pts** for enthusiasm signals in candidate bio
- **+10 pts** if current role aligns with job title

### Final Score
Final Score = (Match Score × 0.6) + (Interest Score × 0.4)

Match weighted higher (60%) because technical fit is non-negotiable. 
Interest (40%) captures whether outreach will actually convert.

---

## 📦 Candidate Database

50 diverse candidate profiles across specializations:

| Range | Specialization |
|-------|---------------|
| c001–c008 | Original profiles (Backend, ML, DevOps, Frontend, Data) |
| c009–c018 | Backend engineers (Python, Go, Java, Node.js) |
| c019–c025 | DevOps / SRE / Platform engineers |
| c026–c030 | Frontend engineers (React, Vue, Angular) |
| c031–c035 | Full Stack engineers |
| c036–c040 | ML / AI engineers |
| c041–c045 | Data engineers |
| c046–c048 | Mobile engineers (iOS, Android, React Native) |
| c049–c050 | Security engineers |

Easily extensible — add more profiles to `backend/data/candidates.json`. Pool size is always read dynamically from the file.

---

## 🎬 Sample Input / Output

### Input (Parse JD)
```json
{
  "raw_jd": "We are looking for a Senior Backend Engineer with 5+ years experience in Python, FastAPI, PostgreSQL, and AWS to build scalable fintech APIs..."
}
```

### Parsed Output (from `/api/parse-jd`)
```json
{
  "title": "Senior Backend Engineer",
  "description": "Building scalable REST APIs for our fintech platform",
  "required_skills": ["Python", "FastAPI", "PostgreSQL", "AWS"],
  "years_experience": 5
}
```

### Scout Output (from `/api/scout`, abbreviated)
```json
{
  "job_title": "Senior Backend Engineer",
  "total_pool": 50,
  "selected": 5,
  "candidates": [
    {
      "name": "Alice Johnson",
      "current_title": "Senior Backend Engineer",
      "match_score": 90,
      "interest_score": 90,
      "final_score": 90,
      "match_breakdown": {
        "skills": [
          {"skill": "Python", "status": "MATCH", "evidence": "Python listed in skills"},
          {"skill": "FastAPI", "status": "MATCH", "evidence": "FastAPI listed in skills"}
        ],
        "experience": {"required": 5, "actual": 6, "status": "MATCH"},
        "reasoning": "Alice matches all required skills and exceeds experience requirement."
      },
      "conversation": {
        "outreach": "Hi Alice, your microservices experience at TechCorp caught our attention...",
        "response": "Thanks for reaching out! Scalable backend systems is exactly my focus...",
        "analysis": "High interest reflects exact title match and enthusiasm for the domain."
      },
      "ranking_explanation": "Perfect skill match, relevant seniority, strong genuine interest."
    }
  ]
}
```

---

## 🚀 Deployment

### Backend (Railway)
- Connect GitHub repo to Railway
- Set root directory to `backend`
- Add environment variables:
  - `ANTHROPIC_API_KEY`: Your Anthropic API key
  - `FRONTEND_URL`: Your Lovable frontend URL (for CORS)
- Auto-deploys on every push to main

### Frontend (Lovable)
- Hosted and managed via [Lovable](https://lovable.dev)
- Built with React + TypeScript + Tailwind CSS + shadcn/ui
- Set the backend API base URL in project settings

---

## 🔮 Production Roadmap

Current implementation uses a mock candidate database for demo reliability. A production system would include:

| Current | Production |
|---------|-----------|
| 50 mock candidates (JSON) | Real ATS / LinkedIn API / GitHub API |
| Single Claude call for all 50 | Multi-stage: vector search → filter → score |
| Simulated conversations | Real email / LinkedIn outreach integration |
| No authentication | API keys + recruiter accounts |
| No caching | Redis cache for repeated JD patterns |

The agent architecture is designed for this evolution — data sources are fully decoupled from scoring logic.

---

## 📋 Tech Stack

**Backend:**
- Python 3.11
- FastAPI 0.104+
- Anthropic Python SDK (AsyncAnthropic)
- Uvicorn (ASGI server)

**AI Model:**
- claude-sonnet-4-6

**Frontend:**
- Lovable (React + TypeScript)
- Tailwind CSS
- shadcn/ui
- Fetch API (HTTP REST)

**Deployment:**
- Railway (Backend)
- Lovable (Frontend)
- GitHub (Source control)

---

## ⚠️ Important Notes

- **Mock Data**: Uses 50 sample candidate profiles for demo purposes
- **No Real Outreach**: Engagement conversations are AI-simulated, not sent
- **API Keys**: Keep your `ANTHROPIC_API_KEY` secure — never commit `.env`
- **Pool Size**: Automatically reads from `candidates.json` — add more anytime

---

**Built for the Deccan AI Catalyst Hackathon — April 2026**  
*AI-powered recruiting that shows its work*
