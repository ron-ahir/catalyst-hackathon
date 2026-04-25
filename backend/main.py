import json
import os
import re
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from anthropic import AsyncAnthropic

load_dotenv()

app = FastAPI(title="Talent Scout Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_candidates():
    with open("data/candidates.json") as f:
        return json.load(f)

candidates_db = load_candidates()

class JobDescription(BaseModel):
    title: str
    description: str
    required_skills: list[str]
    years_experience: int

SYSTEM_PROMPT = """You are a JSON-only talent matching API. You NEVER output markdown, code fences, prose, preambles, apologies, or any text outside of a single JSON object. Your response must begin with { and end with } and be directly parseable by Python json.loads() with zero pre-processing.

Evaluate all candidates internally but only return the TOP 5 by final_score in your JSON response. Do not output data for any other candidates. Your response should contain exactly 5 candidates maximum.

Scoring methodology:
- match_score (0-100): technical alignment. Award 15pts per required skill exact match, 8pts for related skill. Cap skill points at 70. Add 10pts if experience_years >= required, subtract 10pts if experience_years < required - 2.
- interest_score (0-100): Base 50pts. Add 20 if availability "Immediate", 10 if "2 weeks notice", 5 if "3 weeks notice". Add up to 20pts for enthusiasm in "about" field. Add 10pts if current_role aligns with job title.
- final_score: round((match_score * 0.6) + (interest_score * 0.4))

Conversation simulation: outreach must reference the specific job title and one concrete detail from the candidate's profile. Candidate response should sound like a real person consistent with their interest_score.

Output schema (ALL fields required for every candidate):
{
  "job_title": "string",
  "candidates": [{
    "id": "string (match database id exactly, e.g. c001)",
    "name": "string",
    "current_title": "string",
    "match_score": integer,
    "match_breakdown": {
      "skills": [{"skill": "string", "status": "MATCH|NO_MATCH|PARTIAL", "evidence": "string"}],
      "experience": {"required": integer, "actual": integer, "status": "MATCH|NO_MATCH"},
      "reasoning": "string (2 sentences max)"
    },
    "conversation": {
      "outreach": "string (2-3 sentences)",
      "response": "string (2-3 sentences)",
      "analysis": "string (1 sentence)"
    },
    "interest_score": integer,
    "interest_breakdown": {
      "enthusiasm": integer (1-10),
      "timeline": integer (1-10),
      "salary_fit": integer (1-10),
      "reasoning": "string (1 sentence)"
    },
    "final_score": integer,
    "ranking_explanation": "string (1 sentence)"
  }]
}"""


def build_user_message(job_desc: JobDescription, candidates_context: str) -> str:
    return f"""Evaluate all candidates for this role and return the JSON object.

JOB DESCRIPTION:
Title: {job_desc.title}
Description: {job_desc.description}
Required Skills: {', '.join(job_desc.required_skills)}
Minimum Years of Experience: {job_desc.years_experience}

CANDIDATE DATABASE:
{candidates_context}

Return only the top 5 candidates by final_score. Output only the JSON object."""


def extract_json(raw_text: str) -> dict:
    text = raw_text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    fence_match = re.search(r'```(?:json)?\s*(\{.*\})\s*```', text, re.DOTALL)
    if fence_match:
        try:
            return json.loads(fence_match.group(1))
        except json.JSONDecodeError:
            pass
    start, end = text.find('{'), text.rfind('}')
    if start != -1 and end > start:
        try:
            return json.loads(text[start:end+1])
        except json.JSONDecodeError:
            pass
    raise ValueError(f"Cannot extract JSON. First 200 chars: {text[:200]}")


async def scout_stream(job_desc: JobDescription):
    def event(type_, **kwargs):
        return f"data: {json.dumps({'type': type_, **kwargs})}\n\n"

    yield event("progress", message="Parsing job requirements and required skills...")
    yield event("progress", message="Loading candidate database...")

    candidates_context = json.dumps(candidates_db, indent=2)

    yield event("progress", message="Sending candidates to AI for skill matching and scoring...")

    try:
        client = AsyncAnthropic()
        message = await client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=8000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": build_user_message(job_desc, candidates_context)}]
        )

        if message.stop_reason == "max_tokens":
            yield event("error", message="Response truncated — try fewer required skills.")
            return

        yield event("progress", message="Simulating outreach conversations...")
        yield event("progress", message="Calculating final ranking scores...")

        result = extract_json(message.content[0].text)
        result["candidates"] = sorted(
            result.get("candidates", []),
            key=lambda c: c.get("final_score", 0),
            reverse=True
        )
        total_pool = len(result["candidates"])
        result["candidates"] = result["candidates"][:5]
        result["total_pool"] = total_pool
        result["selected"] = len(result["candidates"])
        yield event("complete", data=result)

    except ValueError as e:
        yield event("error", message=str(e))
    except Exception as e:
        yield event("error", message=f"Unexpected error: {str(e)}")


@app.post("/api/scout")
async def scout_candidates(job_desc: JobDescription):
    return StreamingResponse(
        scout_stream(job_desc),
        media_type="text/event-stream",
        headers={"X-Accel-Buffering": "no", "Cache-Control": "no-cache"}
    )

@app.get("/api/candidates")
def get_candidates():
    return {"count": len(candidates_db), "candidates": candidates_db}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "talent-scout-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
