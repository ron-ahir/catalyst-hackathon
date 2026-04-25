function ScoreBadge({ score }) {
  const clamped = Math.min(100, Math.max(0, score));
  const cls = clamped >= 80 ? 'badge-high' : clamped >= 60 ? 'badge-medium' : 'badge-low';
  return <span className={`badge ${cls}`}>{clamped}</span>;
}

export default function CandidateTable({ candidates, jobTitle, onSelect, totalPool, selected }) {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="results-content">
        <p style={{ color: '#888', textAlign: 'center', padding: '40px 20px' }}>
          Submit a job description to see ranked candidates.
        </p>
      </div>
    );
  }

  return (
    <div>
      {jobTitle && (
        <h3 style={{ marginBottom: '4px', color: '#444', fontSize: '1em' }}>
          Results for: <strong>{jobTitle}</strong>
        </h3>
      )}
      {totalPool > 0 && (
        <p style={{ fontSize: '0.85em', color: '#888', marginBottom: '12px', marginTop: 0 }}>
          Showing {selected} candidates selected from a pool of {totalPool}
        </p>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="candidate-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Current Title</th>
              <th>Match</th>
              <th>Interest</th>
              <th>Final Score</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <tr
                key={String(c.id)}
                className="candidate-row"
                onClick={() => onSelect(c)}
              >
                <td><span className="candidate-rank">#{i + 1}</span></td>
                <td><span className="candidate-name">{c.name}</span></td>
                <td><span className="candidate-title">{c.current_title}</span></td>
                <td><ScoreBadge score={c.match_score} /></td>
                <td><ScoreBadge score={c.interest_score} /></td>
                <td><ScoreBadge score={c.final_score} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
