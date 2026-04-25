const spinStyle = {
  display: 'inline-block',
  animation: 'spin 1s linear infinite',
};

export default function ProgressLog({ messages }) {
  return (
    <div className="progress-log">
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div className="progress-log-title">Agent Activity</div>
      {messages.map((msg, i) => {
        const isLast = i === messages.length - 1;
        return (
          <div
            key={i}
            className={`progress-step ${isLast ? 'progress-step-active' : 'progress-step-done'}`}
          >
            <span className="progress-icon" style={isLast ? spinStyle : {}}>
              {isLast ? '⟳' : '✓'}
            </span>
            {msg}
          </div>
        );
      })}
    </div>
  );
}
