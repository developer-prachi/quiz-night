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
    <div className="card shadow-sm quiz-card">
      <div className="quiz-meta mb-2">
        <span>
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="quiz-meta__chip">
          {question.category} &middot; {question.difficulty}
        </span>
      </div>

      <div className="progress mb-4" style={{ height: '6px' }}>
        <div
          className="progress-bar"
          style={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <h2 className="quiz-question mb-4">{question.question}</h2>

      <div className="d-grid gap-2 mb-4">
        {question.options.map((option, index) => (
          <OptionButton
            key={option}
            marker={'ABCD'[index]}
            label={option}
            state={getOptionState(option)}
            disabled={revealed}
            onClick={() => handleReveal(option)}
          />
        ))}
      </div>

      <div className={`timer mb-3 ${isUrgent ? 'is-urgent' : ''}`}>
        <div className="timer__track">
          <div className="timer__fill" style={{ width: `${(timeLeft / SECONDS_PER_QUESTION) * 100}%` }} />
        </div>
        <span className="timer__label" aria-label={`${timeLeft} seconds left`}>{timeLeft}s</span>
      </div>

      {revealed && (
        <button className="btn btn-primary w-100" onClick={onNext}>
          {questionNumber < totalQuestions ? 'Next question' : 'See results'}
        </button>
      )}
    </div>
  );
}
