function ScoreBadge({ score }) {
  const clamped = Math.min(100, Math.max(0, score));
  const cls = clamped >= 80 ? 'badge-high' : clamped >= 60 ? 'badge-medium' : 'badge-low';
  return <span className={`badge ${cls}`}>{clamped}</span>;
}

function SkillIcon({ status }) {
  if (status === 'MATCH') return <span className="skill-match">✓</span>;
  if (status === 'NO_MATCH') return <span className="skill-nomatch">✗</span>;
  return <span className="skill-partial">~</span>;
}

function SubScoreBar({ label, score }) {
  return (
    <div className="sub-score-row">
      <span className="sub-score-label">{label}</span>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${Math.min(10, Math.max(0, score)) * 10}%` }} />
      </div>
      <span className="sub-score-value">{score}</span>
    </div>
  );
}

export default function CandidateDetail({ candidate, onBack }) {
  const mb = candidate.match_breakdown || {};
  const conv = candidate.conversation || {};
  const ib = candidate.interest_breakdown || {};
  const skills = mb.skills || [];
  const exp = mb.experience || {};

  return (
    <div>
      <button className="btn-back" onClick={onBack}>← Back to List</button>

      <div className="detail-header">
        <div>
          <h2>{candidate.name}</h2>
          <span>{candidate.current_title}</span>
        </div>
      </div>

      <div className="score-summary">
        <div className="score-summary-item">
          <span className="score-summary-label">Match</span>
          <ScoreBadge score={candidate.match_score} />
        </div>
        <div className="score-summary-item">
          <span className="score-summary-label">Interest</span>
          <ScoreBadge score={candidate.interest_score} />
        </div>
        <div className="score-summary-item">
          <span className="score-summary-label">Final</span>
          <ScoreBadge score={candidate.final_score} />
        </div>
      </div>

      <div className="detail-panel">
        <h3>Skills Match</h3>
        {skills.length > 0 ? (
          <table className="skills-match-table">
            <tbody>
              {skills.map((s, i) => (
                <tr key={i}>
                  <td style={{ width: '24px' }}><SkillIcon status={s.status} /></td>
                  <td style={{ fontWeight: 500 }}>{s.skill}</td>
                  <td className="skill-evidence-cell">{s.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#888', fontSize: '.9em' }}>No specific skills listed.</p>
        )}
        {exp.required !== undefined && (
          <div className="experience-row">
            <span>Experience required: <strong>{exp.required}yr</strong></span>
            <span>Candidate: <strong>{exp.actual}yr</strong></span>
            <SkillIcon status={exp.status} />
          </div>
        )}
        {mb.reasoning && <p className="reasoning-text">{mb.reasoning}</p>}
      </div>

      <div className="detail-panel">
        <h3>Outreach Conversation</h3>
        <div className="conversation-bubbles">
          {conv.outreach && (
            <div className="chat-bubble chat-bubble-recruiter">
              <div className="chat-bubble-label">Recruiter</div>
              {conv.outreach}
            </div>
          )}
          {conv.response && (
            <div className="chat-bubble chat-bubble-candidate">
              <div className="chat-bubble-label">Candidate</div>
              {conv.response}
            </div>
          )}
        </div>
        {conv.analysis && (
          <div className="conversation-analysis">{conv.analysis}</div>
        )}
      </div>

      <div className="detail-panel">
        <h3>Interest Signals</h3>
        {ib.enthusiasm !== undefined && (
          <SubScoreBar label="Enthusiasm" score={ib.enthusiasm} />
        )}
        {ib.timeline !== undefined && (
          <SubScoreBar label="Timeline" score={ib.timeline} />
        )}
        {ib.salary_fit !== undefined && (
          <SubScoreBar label="Salary Fit" score={ib.salary_fit} />
        )}
        {ib.reasoning && <p className="reasoning-text">{ib.reasoning}</p>}
      </div>

      {candidate.ranking_explanation && (
        <div className="ranking-explanation">
          {candidate.ranking_explanation}
        </div>
      )}
    </div>
  );
}
