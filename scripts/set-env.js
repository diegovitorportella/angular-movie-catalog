// Generates src/environments/environment.ts from environment variables.
// Used on Vercel, where the git-ignored environment.ts does not exist.
const fs = require('fs');
const path = require('path');

const { TMDB_API_KEY, TMDB_ACCESS_TOKEN } = process.env;

if (!TMDB_API_KEY || !TMDB_ACCESS_TOKEN) {
  if (process.env.VERCEL) {
    console.error('Missing TMDB_API_KEY and/or TMDB_ACCESS_TOKEN environment variables.');
    process.exit(1);
  }
  console.log('set-env: env vars not set, keeping existing environment.ts');
  process.exit(0);
}

const content = `export const environment = {
  production: true,
  tmdbApiKey: '${TMDB_API_KEY}',
  tmdbAccessToken: '${TMDB_ACCESS_TOKEN}',
  apiUrl: 'https://api.themoviedb.org/3'
};
`;

const target = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');
fs.writeFileSync(target, content);
console.log('set-env: environment.ts generated');
