import { useState } from 'react';
import OptionButton from './OptionButton';
import { useTimer } from '../hooks/useTimer';

const SECONDS_PER_QUESTION = 20;

export default function QuizScreen({ question, questionNumber, totalQuestions, onAnswer, onNext }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const timeLeft = useTimer(
    SECONDS_PER_QUESTION,
    () => {
      if (!revealed) handleReveal(null);
    },
    question.id
  );

  function handleReveal(choice) {
    if (revealed) return;
    setSelected(choice);
    setRevealed(true);
    onAnswer(choice === question.correctAnswer);
  }

  function getOptionState(option) {
    if (!revealed) return 'idle';
    if (option === question.correctAnswer) return 'correct';
    if (option === selected) return 'wrong';
    return 'muted';
  }

  const isUrgent = timeLeft <= 5;

  return (
    <div className="card shadow-sm p-4">
      <div className="d-flex justify-content-between text-muted small mb-2">
        <span>
          Question {questionNumber} of {totalQuestions}
        </span>
        <span>
          {question.category} &middot; {question.difficulty}
        </span>
      </div>

      <div className="progress mb-3" style={{ height: '6px' }}>
        <div
          className="progress-bar"
          style={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <h2 className="h5 mb-4">{question.question}</h2>

      <div className="d-grid gap-2 mb-4">
        {question.options.map((option) => (
          <OptionButton
            key={option}
            label={option}
            state={getOptionState(option)}
            disabled={revealed}
            onClick={() => handleReveal(option)}
          />
        ))}
      </div>

      <div className="progress mb-3" style={{ height: '6px' }}>
        <div
          className={`progress-bar ${isUrgent ? 'bg-danger' : 'bg-warning'}`}
          style={{ width: `${(timeLeft / SECONDS_PER_QUESTION) * 100}%` }}
        />
      </div>

      {revealed && (
        <button className="btn btn-primary w-100" onClick={onNext}>
          {questionNumber < totalQuestions ? 'Next question' : 'See results'}
        </button>
      )}
    </div>
  );
}
