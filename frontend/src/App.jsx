import React, { useState, useRef } from 'react';
import JobForm from './components/JobForm';
import ProgressLog from './components/ProgressLog';
import CandidateTable from './components/CandidateTable';
import CandidateDetail from './components/CandidateDetail';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [progressMessages, setProgressMessages] = useState([]);
  const [poolStats, setPoolStats] = useState({ total: 0, selected: 0 });

  const timerRefs = useRef([]);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

  const clearTimers = () => {
    timerRefs.current.forEach(t => clearTimeout(t));
    timerRefs.current = [];
  };

  const handleScout = async (jobData) => {
    setError('');
    setIsLoading(true);
    setCandidates([]);
    setSelectedCandidate(null);
    setProgressMessages([]);
    setJobTitle(jobData.title);
    setPoolStats({ total: 0, selected: 0 });

    clearTimers();

    const timedSteps = [
      [5000,  'Analyzing skill matches across 50 candidates...'],
      [10000, 'Simulating personalized outreach conversations...'],
      [15000, 'Calculating interest and engagement scores...'],
      [20000, 'Ranking candidates by combined score...'],
    ];

    timedSteps.forEach(([delay, msg]) => {
      const t = setTimeout(() => {
        setProgressMessages(prev => [...prev, msg]);
      }, delay);
      timerRefs.current.push(t);
    });

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
            if (evt.type === 'progress') {
              setProgressMessages(prev => [...prev, evt.message]);
            } else if (evt.type === 'complete') {
              clearTimers();
              setCandidates(evt.data.candidates || []);
              setPoolStats({ total: evt.data.total_pool || 0, selected: evt.data.selected || 0 });
              setIsLoading(false);
            } else if (evt.type === 'error') {
              clearTimers();
              setError(evt.message);
              setIsLoading(false);
            }
          } catch (_) {}
        }
      }
    } catch (err) {
      clearTimers();
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
          {isLoading && <ProgressLog messages={progressMessages} />}
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
