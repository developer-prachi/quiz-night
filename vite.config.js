import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so it works whether it's served from a domain root (Netlify)
  // or a project subpath (GitHub Pages, e.g. username.github.io/quiz-night/).
  base: './',
});
