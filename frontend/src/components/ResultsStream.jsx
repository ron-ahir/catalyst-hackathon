import React, { useEffect, useRef } from 'react';

function ResultsStream({ content, isLoading, error }) {
  const resultsRef = useRef(null);

  // Auto-scroll to bottom as new content arrives
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div className="results-container">
      {error && <div className="error">Error: {error}</div>}
      {content && <div className="success">✓ Scouting in progress - watch Claude think in real-time!</div>}

      {content || isLoading ? (
        <div ref={resultsRef} className="results-content">
          {content ? (
            <pre>{content}</pre>
          ) : (
            <div className="loading">
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>🔍</div>
              Discovering candidates and analyzing matches...
            </div>
          )}
        </div>
      ) : (
        <div
          className="results-content"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '1.1em',
          }}
        >
          Enter a job description and click "Scout Candidates" to see real-time AI analysis
        </div>
      )}
    </div>
  );
}

export default ResultsStream;
