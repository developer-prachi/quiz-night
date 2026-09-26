function getMessage(percentage) {
  if (percentage === 100) return 'Clean sweep. Every question, right.';
  if (percentage >= 70) return 'Strong round — most of those landed.';
  if (percentage >= 40) return 'A fair few landed. Room to climb.';
  return 'Rough round. The next ten will go better.';
}

export default function ResultsScreen({ score, total, onRestart }) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="card shadow-sm quiz-card text-center">
      <p className="eyebrow justify-content-center">Your score</p>
      <h1 className="score">
        {score}
        <span className="score__total"> / {total}</span>
      </h1>
      <p className="text-muted mb-4">{getMessage(percentage)}</p>
      <button className="btn btn-primary w-100" onClick={onRestart}>
        Play again
      </button>
    </div>
  );
}
