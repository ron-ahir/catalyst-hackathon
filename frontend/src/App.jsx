import React, { useState, useRef } from 'react';
import JobForm from './components/JobForm';
import CandidateTable from './components/CandidateTable';
import CandidateDetail from './components/CandidateDetail';
import './index.css';

const MESSAGES = [
  'Analyzing candidate profiles...',
  'Matching skills against job requirements...',
  'Simulating outreach conversations...',
  'Scoring candidate interest levels...',
  'Ranking and selecting top matches...',
  'Preparing your shortlist...',
];

const SPINNER_CHARS = ['|', '/', '—', '\\'];

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [poolStats, setPoolStats] = useState({ total: 0, selected: 0 });
  const [spinnerChar, setSpinnerChar] = useState('|');
  const [msgIndex, setMsgIndex] = useState(0);

  const spinnerRef = useRef(null);
  const messageRef = useRef(null);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

  const clearIntervals = () => {
    if (spinnerRef.current) { clearInterval(spinnerRef.current); spinnerRef.current = null; }
    if (messageRef.current) { clearInterval(messageRef.current); messageRef.current = null; }
  };

  const handleScout = async (jobData) => {
    setError('');
    setIsLoading(true);
    setCandidates([]);
    setSelectedCandidate(null);
    setJobTitle(jobData.title);
    setPoolStats({ total: 0, selected: 0 });
    setSpinnerChar('|');
    setMsgIndex(0);

    clearIntervals();

    let spinIdx = 0;
    spinnerRef.current = setInterval(() => {
      spinIdx = (spinIdx + 1) % SPINNER_CHARS.length;
      setSpinnerChar(SPINNER_CHARS[spinIdx]);
    }, 300);

    let mIdx = 0;
    messageRef.current = setInterval(() => {
      mIdx = (mIdx + 1) % MESSAGES.length;
      setMsgIndex(mIdx);
    }, 6000);

    try {
      const response = await fetch(`${API_BASE}/api/scout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          try {
            const evt = JSON.parse(line.slice(6));
            if (evt.type === 'complete') {
              clearIntervals();
              setCandidates(evt.data.candidates || []);
              setPoolStats({ total: evt.data.total_pool || 0, selected: evt.data.selected || 0 });
              setIsLoading(false);
            } else if (evt.type === 'error') {
              clearIntervals();
              setError(evt.message);
              setIsLoading(false);
            }
          } catch (_) {}
        }
      }
    } catch (err) {
      clearIntervals();
      setError(err.message || 'Failed to connect to API. Make sure the backend is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎯 Talent Scout Agent</h1>
        <p>AI-Powered Candidate Discovery & Ranking</p>
      </div>

      <div className="main-content">
        <div className="section">
          <h2>Job Description</h2>
          <JobForm onSubmit={handleScout} isLoading={isLoading} />
        </div>

        <div className="section">
          <h2>Results</h2>
          {error && <div className="error">{error}</div>}
          {isLoading && (
            <div style={{ textAlign: 'center', fontSize: '1em', color: '#667eea', padding: '40px 20px' }}>
              {spinnerChar} {MESSAGES[msgIndex]}
            </div>
          )}
          {!isLoading && selectedCandidate ? (
            <CandidateDetail
              candidate={selectedCandidate}
              onBack={() => setSelectedCandidate(null)}
            />
          ) : (
            !isLoading && (
              <CandidateTable
                candidates={candidates}
                jobTitle={jobTitle}
                onSelect={setSelectedCandidate}
                totalPool={poolStats.total}
                selected={poolStats.selected}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
