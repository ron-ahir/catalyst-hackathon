# 🎯 AI-Powered Talent Scouting & Engagement Agent

A cutting-edge hackathon project that uses Claude AI to discover, score, and engage with top talent candidates based on job descriptions. Features real-time streaming analysis, agentic iteration loops, and full-stack deployment.

**Hackathon**: Deccan AI Catalyst  
**Deadline**: April 27, 1:00 AM IST  
**Status**: Building 🚀

---

## 🎯 Problem Statement

Recruiting is slow and manual. This agent automates talent discovery:

- **Input**: Job Description (title, description, skills, experience level)
- **Output**: Ranked shortlist with Match Scores + Interest Scores
- **Process**: JD parsing → candidate discovery → engagement simulation → ranking with reasoning

---

## ✨ What Makes It Special

### 1. **Agentic Loop with Iteration**
- Agent discovers initial candidates
- Simulates engagement emails to gauge interest
- Analyzes responses to refine understanding
- Re-discovers additional candidates if needed
- Produces final ranked shortlist with detailed reasoning

### 2. **Real-Time Streaming**
- Judges see Claude's thinking process in real-time
- Token-by-token streaming via Server-Sent Events (SSE)
- Live progress updates as candidates are discovered and scored

### 3. **Full-Stack Integration**
- Backend: FastAPI with Claude API streaming
- Frontend: React with real-time UI updates
- Deployment ready for Railway (backend) and Vercel (frontend)

---

## 🏗️ Architecture

```
talent-scout-agent/
├── backend/
│   ├── main.py                 # FastAPI app with streaming endpoint
│   ├── data/
│   │   └── candidates.json     # Mock candidate database
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main app component
│   │   ├── index.jsx           # React entry point
│   │   ├── index.css           # Tailwind-inspired styling
│   │   └── components/
│   │       ├── JobForm.jsx     # Job description input form
│   │       └── ResultsStream.jsx # Real-time results display
│   ├── public/index.html       # HTML template
│   └── package.json            # Frontend dependencies
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- Anthropic API key

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
   python main.py
   ```
   Backend runs on `http://localhost:8000`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run development server**
   ```bash
   REACT_APP_API_BASE=http://localhost:8000 npm start
   ```
   Frontend runs on `http://localhost:3000`

---

## 💻 How to Use

1. **Enter Job Description**
   - Job title (e.g., "Senior Backend Engineer")
   - Job description (responsibilities, requirements)
   - Required skills (add individually)
   - Years of experience required

2. **Click "Scout Candidates"**
   - Watch real-time streaming analysis
   - See Claude's thinking as it evaluates candidates
   - Candidates scored on Match Score and Interest Score

3. **Review Results**
   - Top-ranked candidates with scores
   - Detailed matching reasoning
   - Engagement recommendations

---

## 📊 API Endpoints

### POST `/api/scout`
Streams talent scouting results in real-time.

**Request Body:**
```json
{
  "title": "Senior Backend Engineer",
  "description": "We're looking for...",
  "required_skills": ["Python", "FastAPI", "PostgreSQL"],
  "years_experience": 5
}
```

**Response:** Server-Sent Events (SSE) stream
```
data: {"chunk": "text content..."}
data: {"chunk": "more text..."}
```

### GET `/api/candidates`
Returns all available candidates in the database.

**Response:**
```json
{
  "count": 8,
  "candidates": [...]
}
```

### GET `/health`
Health check endpoint.

---

## 🔑 Key Features Explained

### Real-Time Streaming
- **How**: FastAPI with `StreamingResponse` + Claude API streaming
- **Why**: Judges see the AI's thought process, not just final results
- **Implementation**: `talent_scouting_stream()` generator yields tokens

### Candidate Scoring
- **Match Score (0-100)**: How well candidate's skills align with JD
- **Interest Score (0-100)**: Likelihood candidate would be interested
- **Reasoning**: Detailed explanation for each score

### Agentic Loop
1. Parse JD to identify core requirements
2. Initial candidate discovery with scoring
3. Simulate engagement emails
4. Analyze interest signals
5. Re-discover additional candidates if needed
6. Produce final ranked shortlist

---

## 📦 Mock Candidate Database

8 sample candidates with diverse profiles:
- Alice Johnson (Senior Backend Engineer)
- Bob Chen (Full Stack Engineer)
- Carol Martinez (ML Engineer)
- David Kumar (DevOps Engineer)
- Emma Wilson (Frontend Engineer)
- Frank Anderson (Senior Software Engineer)
- Grace Lee (Data Engineer)
- Henry Zhang (Platform Engineer)

Easily extensible - add more candidates to `backend/data/candidates.json`

---

## 🎬 Demo

### Sample Input:
```
Job Title: Senior Backend Engineer
Description: We're building a scalable payments platform...
Skills: Python, FastAPI, PostgreSQL, AWS, Docker
Experience: 6+ years
```

### Sample Output:
```
🔍 ANALYZING JOB DESCRIPTION
- Core Requirements: Python, FastAPI, Database Design, Cloud Architecture
- Team Size: 1 specialist needed
- Urgency: High

🎯 CANDIDATE DISCOVERY & RANKING

TOP 3 RECOMMENDED CANDIDATES:

1. Alice Johnson ⭐⭐⭐⭐⭐
   Match Score: 95/100
   Interest Score: 85/100
   Reason: 6+ years backend experience, expert in Python/FastAPI/PostgreSQL/AWS
   
2. Frank Anderson ⭐⭐⭐⭐
   Match Score: 92/100
   Interest Score: 72/100
   Reason: 10 years senior experience, distributed systems expert
   
3. David Kumar ⭐⭐⭐⭐
   Match Score: 78/100
   Interest Score: 88/100
   Reason: DevOps expertise, AWS certified, available immediately
```

---

## 🚀 Deployment

### Backend (Railway)
```bash
# Create Railway project, connect to repo
# Add environment variables: ANTHROPIC_API_KEY, FRONTEND_URL
# Deploy automatically from main branch
# Backend URL: https://your-app.railway.app
```

### Frontend (Vercel)
```bash
# Create Vercel project, connect to repo
# Add build command: npm build
# Add environment: REACT_APP_API_BASE=https://your-api.railway.app
# Deploy automatically from main branch
# Frontend URL: https://your-app.vercel.app
```

---

## 🎓 Learning Goals

This project demonstrates:
- ✅ Claude API streaming for real-time token generation
- ✅ Multi-turn agentic loops for iterative problem-solving
- ✅ Full-stack integration: FastAPI backend + React frontend
- ✅ Server-Sent Events for real-time frontend updates
- ✅ Production deployment (Railway + Vercel)
- ✅ Practical AI application in recruiting

---

## 📋 Tech Stack

**Backend:**
- Python 3.9+
- FastAPI 0.104+
- Anthropic Python SDK
- Uvicorn (ASGI server)

**Frontend:**
- React 18+
- Vanilla CSS with modern styling
- Fetch API for streaming

**Deployment:**
- Railway (Backend)
- Vercel (Frontend)
- GitHub (Source control)

---

## 🤝 Contributing

This is a hackathon project. To extend:
1. Add more candidates to `backend/data/candidates.json`
2. Enhance scoring logic in `main.py`
3. Add UI features in `frontend/src/`
4. Integrate real candidate databases (LinkedIn API, etc.)

---

## ⚠️ Important Notes

- **Mock Data**: Uses sample candidates for demo purposes
- **No Real Emails**: Engagement simulation is AI-generated, not sent
- **API Keys**: Keep your ANTHROPIC_API_KEY secure
- **Rate Limits**: Claude API has rate limits (adjust as needed)

---

## 📞 Support

- Stuck? Check the Architecture section above
- Questions? Review the inline code comments
- Errors? Check backend logs with `python main.py`

---

**Built with ❤️ for the Deccan AI Catalyst Hackathon**  
*Bringing AI-powered recruiting to the future*