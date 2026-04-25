export default function ProgressLog({ messages }) {
  return (
    <div className="progress-log">
      <div className="progress-log-title">Agent Activity</div>
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`progress-step ${i === messages.length - 1 ? 'progress-step-active' : 'progress-step-done'}`}
        >
          <span className="progress-icon">{i === messages.length - 1 ? '⟳' : '✓'}</span>
          {msg}
        </div>
      ))}
    </div>
  );
}
