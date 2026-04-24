"""
AI-Powered Talent Scouting & Engagement Agent
Backend API with Claude streaming for real-time candidate discovery and ranking
"""

import json
import os
from typing import Generator
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from anthropic import Anthropic

load_dotenv()

app = FastAPI(title="Talent Scout Agent")

# CORS configuration for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Anthropic()

# Load mock candidate database
def load_candidates():
    with open("data/candidates.json") as f:
        return json.load(f)

candidates_db = load_candidates()

class JobDescription(BaseModel):
    title: str
    description: str
    required_skills: list[str]
    years_experience: int

def format_candidates_context() -> str:
    """Format candidates database for Claude context"""
    return json.dumps(candidates_db, indent=2)

def talent_scouting_stream(job_desc: JobDescription) -> Generator[str, None, None]:
    """
    Agentic loop that:
    1. Parses JD and identifies key requirements
    2. Discovers matching candidates with scoring
    3. Simulates engagement/outreach
    4. Analyzes engagement responses
    5. Re-discovers more candidates if needed
    6. Produces final ranked shortlist with reasoning
    """

    candidates_context = format_candidates_context()

    system_prompt = """You are an AI Talent Scouting Agent. Your job is to:
1. Parse job descriptions to understand key requirements
2. Search through the candidate database to find matches
3. Score candidates on Match Score (0-100) and Interest Score (0-100)
4. Simulate engagement emails to gauge interest
5. Analyze responses to refine rankings
6. Provide final ranked shortlist with detailed reasoning

For each candidate, explain:
- Why they match the role (specific skills, experience)
- Match Score (technical fit)
- Interest Score (likelihood to engage)
- Engagement strategy
- Final recommendation ranking

Format your output with clear sections and use markdown for readability.
Stream your thinking process so the user sees your analysis in real-time."""

    user_message = f"""Analyze this job description and find the best matching candidates from our database.

JOB DESCRIPTION:
Title: {job_desc.title}
Description: {job_desc.description}
Required Skills: {', '.join(job_desc.required_skills)}
Experience Required: {job_desc.years_experience}+ years

CANDIDATE DATABASE:
{candidates_context}

Please:
1. Parse the JD and identify core requirements
2. Score each candidate with Match Score and Interest Score
3. Explain why each candidate matches
4. Simulate an engagement email for top candidates
5. Provide final ranked shortlist (top 3-5 candidates)
6. For each recommended candidate, provide:
   - Match Score (0-100)
   - Interest Score (0-100)
   - Key matching skills
   - Engagement recommendation
   - Reasoning for ranking

Stream your analysis step-by-step."""

    # Multi-turn conversation with Claude for iterative refinement
    messages = [{"role": "user", "content": user_message}]

    with client.messages.stream(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2000,
        system=system_prompt,
        messages=messages,
    ) as stream:
        for text in stream.text_stream:
            yield f"data: {json.dumps({'chunk': text})}\n\n"

@app.post("/api/scout")
async def scout_candidates(job_desc: JobDescription):
    """
    Endpoint that streams talent scouting results using Server-Sent Events (SSE)
    Frontend subscribes to this endpoint to receive real-time analysis
    """
    try:
        return StreamingResponse(
            talent_scouting_stream(job_desc),
            media_type="text/event-stream",
            headers={"X-Accel-Buffering": "no"}  # Disable buffering for real-time streaming
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/candidates")
def get_candidates():
    """Endpoint to fetch all available candidates (for frontend reference)"""
    return {"count": len(candidates_db), "candidates": candidates_db}

@app.get("/health")
def health_check():
    """Health check endpoint for deployment monitoring"""
    return {"status": "ok", "service": "talent-scout-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
