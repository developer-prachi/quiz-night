# Quiz Night

A ten-question trivia quiz built in React and Bootstrap, pulling live
questions from the [Open Trivia Database](https://opentdb.com) — pick a
category, a difficulty, and how many questions you want.

**[Live demo](https://developer-prachi.github.io/quiz-night/)** · **[Code](https://github.com/developer-prachi/quiz-night)**

## Features

- Live questions and categories from a public API, not a hardcoded array
- A session token, so the same category won't repeat questions you've
  already seen across attempts
- Friendly error messages for what the API can actually throw at you (not
  enough questions for a combination, rate limiting) with a "Try again" button
- A per-question countdown timer
- Loading and error states, not just the happy path

## How the trickier bits work

**Session tokens.** Open Trivia DB lets you request a token that remembers
which questions it's already shown you, so you don't get the same ones
twice. The app asks for one the first time you start a quiz, and reuses it
for every attempt after that.

**When the token runs out.** If a token has already given you every
question in a category/difficulty (`response_code: 4`), or the token isn't
recognised anymore (`response_code: 3`), the app quietly asks for a new
token and retries once — you never see an error for this, it just works.

**Rate limiting.** If you start quizzes too quickly in a row
(`response_code: 5`), the API says so — the app shows that as a plain
message with a "Try again" button rather than a blank screen.

**Why there's no request-cancellation code.** The obvious next worry is:
what if someone clicks "Start Quiz" twice before the first request
finishes? Here, that can't actually happen — the moment you click it, the
button disappears and a loading spinner takes its place. No visible button,
no double click, no race condition to clean up. Sometimes the simplest fix
for a bug is making it impossible rather than handling it after the fact.

## Stack

React 18, Vite, Bootstrap 5 (via CDN link in `index.html`) — no custom CSS
framework, no component library, just Bootstrap's own classes.

## Project structure

```
src/
  App.jsx                stage/state machine + token + error/retry logic
  index.css               a couple of global lines, Bootstrap does the rest
  components/
    StartScreen.jsx        category / difficulty / question-count form
    QuizScreen.jsx          question, options, timer
    OptionButton.jsx        one answer button (idle/correct/wrong/muted)
    ResultsScreen.jsx       final score + replay
  hooks/
    useTimer.js             countdown hook, restarts per question
  utils/
    triviaApi.js            all the fetch calls, decoding, shuffling
```

## Running it locally

```bash
npm install
npm run dev
```

## Deploying

**GitHub Pages**, using the included script:

```bash
npm run deploy
```

This builds the app and pushes `dist/` to a `gh-pages` branch — enable
GitHub Pages on that branch in your repo settings.

**Netlify** — drag the `dist/` folder (after `npm run build`) onto
[app.netlify.com/drop](https://app.netlify.com/drop).

## Notes

Open Trivia DB has a short per-IP cooldown between requests — if you see
"Too many requests" while testing repeatedly, wait a few seconds.

---

Part of my portfolio: [developer-prachi.github.io](https://developer-prachi.github.io)
