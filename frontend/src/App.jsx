import React, { useState } from 'react';
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

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

  const handleScout = async (jobData) => {
    setError('');
    setIsLoading(true);
    setCandidates([]);
    setSelectedCandidate(null);
    setProgressMessages([]);
    setJobTitle(jobData.title);

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
              setCandidates(evt.data.candidates || []);
              setIsLoading(false);
            } else if (evt.type === 'error') {
              setError(evt.message);
              setIsLoading(false);
            }
          } catch (_) {}
        }
      }
    } catch (err) {
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
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
