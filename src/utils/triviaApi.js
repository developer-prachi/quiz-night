const BASE_URL = 'https://opentdb.com';

// Gets a fresh "session token". Open Trivia DB uses this to remember which
// questions it has already given us, so a token means: don't repeat
// questions I've already seen in this session.
export async function fetchToken() {
  const res = await fetch(`${BASE_URL}/api_token.php?command=request`);
  const data = await res.json();
  return data.token;
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/api_category.php`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.trivia_categories || [];
}

// Returns the raw parsed response, including response_code, so the caller
// (App.jsx) can decide what to do about errors, retries, etc.
export async function fetchQuestions({ amount, category, difficulty, token }) {
  const params = new URLSearchParams({ amount: String(amount), type: 'multiple' });
  if (category) params.set('category', category);
  if (difficulty) params.set('difficulty', difficulty);
  if (token) params.set('token', token);

  const res = await fetch(`${BASE_URL}/api.php?${params.toString()}`);
  const data = await res.json();
  return data;
}

// Open Trivia DB sends question/answer text with HTML entities still encoded
// (things like &quot; and &#039;). This turns them back into normal text.
export function decodeHtml(html) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

export function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Turns the raw API results into the shape our components actually want:
// decoded text, and the four options already shuffled together.
export function shapeQuestions(results) {
  return results.map((q, index) => {
    const correctAnswer = decodeHtml(q.correct_answer);
    const options = shuffle([...q.incorrect_answers.map(decodeHtml), correctAnswer]);
    return {
      id: index,
      category: decodeHtml(q.category),
      difficulty: q.difficulty,
      question: decodeHtml(q.question),
      options,
      correctAnswer,
    };
  });
}
