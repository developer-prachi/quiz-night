import { useState } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import { SiteBar, SiteFooter } from './components/SiteChrome';
import { fetchToken, fetchQuestions, shapeQuestions } from './utils/triviaApi';

function getErrorMessage(responseCode) {
  if (responseCode === 1) {
    return "There aren't enough questions for that combination — try a different category, difficulty, or fewer questions.";
  }
  if (responseCode === 2) {
    return 'That combination of settings was rejected — try adjusting the filters.';
  }
  if (responseCode === 5) {
    return 'Too many requests in a row — wait a few seconds, then try again.';
  }
  return 'Something went wrong loading questions.';
}

// stage: 'start' | 'loading' | 'quiz' | 'results' | 'error'
export default function App() {
  const [stage, setStage] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(null);
  const [lastConfig, setLastConfig] = useState(null);

  async function loadQuestions(config) {
    // Get a session token the first time, so the API knows not to repeat
    // questions we've already been given.
    let activeToken = token;
    if (!activeToken) {
      activeToken = await fetchToken();
      setToken(activeToken);
    }

    let data = await fetchQuestions({ ...config, token: activeToken });

    // response_code 3 = token wasn't recognised, 4 = this token has already
    // used up every question for this category/difficulty. Either way: get
    // a brand new token and try one more time before giving up.
    if (data.response_code === 3 || data.response_code === 4) {
      activeToken = await fetchToken();
      setToken(activeToken);
      data = await fetchQuestions({ ...config, token: activeToken });
    }

    return data;
  }

  async function handleStart(config) {
    setLastConfig(config);
    setStage('loading');
    setErrorMessage('');

    try {
      const data = await loadQuestions(config);

      if (data.response_code !== 0) {
        setErrorMessage(getErrorMessage(data.response_code));
        setStage('error');
        return;
      }

      setQuestions(shapeQuestions(data.results));
      setCurrentIndex(0);
      setScore(0);
      setStage('quiz');
    } catch (err) {
      setErrorMessage('Could not reach the trivia service. Check your connection and try again.');
      setStage('error');
    }
  }

  function handleAnswer(isCorrect) {
    if (isCorrect) setScore((s) => s + 1);
  }

  function handleNext() {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      setStage('results');
    }
  }

  function handleRestart() {
    setStage('start');
  }

  return (
    <>
      <SiteBar title="Quiz Night" />
      <main className="app-shell d-flex align-items-center justify-content-center">
        <div style={{ width: '100%', maxWidth: '520px' }}>
          {stage === 'start' && <StartScreen onStart={handleStart} />}

          {stage === 'loading' && (
            <div className="card shadow-sm quiz-card text-center">
              <div className="spinner-border text-primary mx-auto mb-3" role="status">
                <span className="visually-hidden">Loading…</span>
              </div>
              <p className="mb-0">Fetching your questions…</p>
            </div>
          )}

          {stage === 'error' && (
            <div className="card shadow-sm quiz-card">
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
              <button className="btn btn-primary w-100" onClick={() => handleStart(lastConfig)}>
                Try again
              </button>
            </div>
          )}

          {stage === 'quiz' && questions.length > 0 && (
            <QuizScreen
              key={questions[currentIndex].id}
              question={questions[currentIndex]}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          )}

          {stage === 'results' && (
            <ResultsScreen score={score} total={questions.length} onRestart={handleRestart} />
          )}
        </div>
      </main>
      <SiteFooter repo="quiz-night" />
    </>
  );
}
