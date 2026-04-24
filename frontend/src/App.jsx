import React, { useState } from 'react';
import JobForm from './components/JobForm';
import ResultsStream from './components/ResultsStream';
import './index.css';

function App() {
  const [streamContent, setStreamContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const eventSourceRef = React.useRef(null);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

  const handleScout = async (jobData) => {
    setStreamContent('');
    setError('');
    setIsLoading(true);

    try {
      // Close any existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Make POST request to backend streaming endpoint
      const response = await fetch(`${API_BASE}/api/scout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      // Parse streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // Parse Server-Sent Events format: "data: {json}\n\n"
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.chunk) {
                setStreamContent((prev) => prev + data.chunk);
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to API. Make sure the backend is running.');
      console.error('Scout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎯 Talent Scout Agent</h1>
        <p>AI-Powered Candidate Discovery & Ranking with Real-Time Streaming</p>
      </div>

      <div className="main-content">
        <div className="section">
          <h2>Job Description</h2>
          <JobForm onSubmit={handleScout} isLoading={isLoading} />
        </div>

        <div className="section">
          <h2>Live Analysis</h2>
          <ResultsStream content={streamContent} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
}

export default App;
