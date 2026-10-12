# Frontend

React + TypeScript (Vite) client for the portfolio. See the [root README](../README.md) for full project setup, architecture, and backend instructions.

## Quick start

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:5173/.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Structure

- `src/Components/` — pages and UI components (`Home`, `About`, `ProjectList`, `RepoDetail`, `Nav`, `Card`) plus data hooks (`useGithubRepos`, `useProjects`).
- `src/App.tsx` — routes: `/`, `/about`, `/projects`, `/projects/:name/`.
- `public/` — static assets such as the favicon.

Repository data is fetched from the public GitHub REST API. The Django projects API can be consumed through `useProjects.tsx`.
