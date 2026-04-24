# 🚀 Quick Start Guide

Get the Talent Scout Agent running locally in 5 minutes.

## ⚡ TL;DR

```bash
# Terminal 1: Backend
cd backend
cp .env.example .env
# Edit .env and add ANTHROPIC_API_KEY
pip install -r requirements.txt
python main.py

# Terminal 2: Frontend
cd frontend
cp .env.example .env.local
npm install
REACT_APP_API_BASE=http://localhost:8000 npm start
```

Then open http://localhost:3000 in your browser.

---

## 📋 Step-by-Step Setup

### Step 1: Get Your API Key
1. Go to https://console.anthropic.com
2. Create account or sign in
3. Generate an API key
4. Save it securely

### Step 2: Backend Setup
```bash
cd backend

# Create .env file
cp .env.example .env

# Edit .env with your API key
# On Linux/Mac: nano .env
# On Windows: notepad .env
# Add: ANTHROPIC_API_KEY=sk-ant-xxxxx
# Add: FRONTEND_URL=http://localhost:3000

# Install Python dependencies
pip install -r requirements.txt
# (Or use: python -m pip install -r requirements.txt)

# Run the backend server
python main.py
# You should see: "Application startup complete"
# Backend is running on http://localhost:8000
```

### Step 3: Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install
# (This may take 2-3 minutes on first run)

# Create environment file
cp .env.example .env.local

# Start development server
REACT_APP_API_BASE=http://localhost:8000 npm start
# Browser should open http://localhost:3000 automatically
```

---

## 🧪 Testing the Setup

### Test Backend
```bash
# In a new terminal:
curl http://localhost:8000/health

# Expected response:
# {"status":"ok","service":"talent-scout-api"}
```

### Test Frontend
1. Open http://localhost:3000 in browser
2. You should see the Talent Scout interface
3. Fill in a job description:
   - Title: "Senior Backend Engineer"
   - Description: "We need someone to build scalable APIs"
   - Skills: Python, FastAPI, PostgreSQL
   - Experience: 5+
4. Click "Scout Candidates"
5. Watch real-time streaming analysis!

---

## 🐛 Troubleshooting

### "No module named anthropic"
```bash
cd backend
pip install anthropic
```

### "ANTHROPIC_API_KEY not found"
```bash
# Make sure .env file exists and has:
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Or set it directly:
export ANTHROPIC_API_KEY=sk-ant-xxxxx
python main.py
```

### Frontend shows "Failed to connect to API"
1. Make sure backend is running: `curl http://localhost:8000/health`
2. Check REACT_APP_API_BASE is set: `echo $REACT_APP_API_BASE`
3. Browser console (F12) may have CORS errors if URL is wrong

### Port already in use
```bash
# Backend on different port:
python main.py --port 8001

# Frontend on different port:
PORT=3001 npm start
# Then update REACT_APP_API_BASE=http://localhost:8001
```

---

## 📊 What Happens When You Scout

1. **Frontend** sends job description to backend
2. **Backend** receives request and starts streaming
3. **Claude API** analyzes candidates in real-time
4. **Tokens stream** back via Server-Sent Events
5. **Frontend** displays analysis as it arrives
6. **Final output** includes ranked candidate list with scores

---

## 📁 Key Files to Know

- `backend/main.py` - FastAPI app and streaming logic
- `backend/data/candidates.json` - Candidate database (edit to add more)
- `frontend/src/App.jsx` - Main React component
- `frontend/src/components/JobForm.jsx` - Input form
- `frontend/src/components/ResultsStream.jsx` - Real-time display

---

## 🎯 Next Steps

After getting it running:
1. Try different job descriptions
2. Add more candidates to `candidates.json`
3. Customize the scoring prompt in `main.py`
4. Prepare for deployment to Railway + Vercel

---

## ⏱️ Expected Timing

- Backend startup: ~2 seconds
- Frontend startup: ~15 seconds
- First request processing: ~10-15 seconds (Claude API call)
- Subsequent requests: ~15-20 seconds

---

**Need help?** Check README.md for more details about architecture and features.
