import { useEffect, useState } from 'react';
import { fetchCategories } from '../utils/triviaApi';

const DIFFICULTIES = [
  { value: '', label: 'Any difficulty' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export default function StartScreen({ onStart }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [amount, setAmount] = useState(10);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    onStart({ amount, category, difficulty });
  }

  return (
    <div className="card shadow-sm quiz-card">
      <p className="eyebrow">Trivia &middot; Open Trivia DB</p>
      <h1 className="h2 mb-2">
        Quiz <em className="accent-em">Night</em>
      </h1>
      <p className="text-muted mb-4">Questions pulled live from the internet. Pick your settings and go.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Any category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Difficulty</label>
          <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">Number of questions</label>
          <input
            type="number"
            className="form-control"
            min={5}
            max={20}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Start Quiz
        </button>
      </form>
    </div>
  );
}
