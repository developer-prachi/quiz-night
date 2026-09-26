import { useState } from 'react';

const PORTFOLIO_URL = 'https://developer-prachi.github.io/#work';
const GITHUB_URL = 'https://github.com/developer-prachi';

function currentTheme() {
  return document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
}

// Top bar shared with the other portfolio apps: a link back to the
// portfolio, the app's name, and a light/dark toggle. The theme is saved
// under the same key the portfolio uses, so the choice follows you around.
export function SiteBar({ title }) {
  const [theme, setTheme] = useState(currentTheme);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (err) {
      // storage unavailable - the theme just won't be remembered
    }
    setTheme(next);
  }

  return (
    <header className="site-bar">
      <a className="site-bar__back" href={PORTFOLIO_URL}>
        <span className="site-bar__mark" aria-hidden="true">P</span>
        <span className="site-bar__label">
          <span className="site-bar__arrow" aria-hidden="true">&larr; </span>
          Prachi&apos;s portfolio
        </span>
      </a>
      <span className="site-bar__title">{title}</span>
      <button
        type="button"
        className="site-bar__toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 14.6A8.5 8.5 0 0 1 9.4 3.8a8.5 8.5 0 1 0 10.8 10.8Z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" /></svg>
        )}
      </button>
    </header>
  );
}

export function SiteFooter({ repo }) {
  return (
    <footer className="site-foot">
      Built by Prachi &middot;{' '}
      <a href={`${GITHUB_URL}/${repo}`} target="_blank" rel="noreferrer">View source</a>
      {' '}&middot;{' '}
      <a href={PORTFOLIO_URL}>More projects</a>
    </footer>
  );
}
