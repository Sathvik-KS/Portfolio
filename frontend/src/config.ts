// Centralized runtime configuration.
// All values can be overridden via Vite environment variables (.env).
// See .env.example for the full list.

export const config = {
  /** GitHub username whose repositories are displayed on the portfolio. */
  githubUsername: import.meta.env.VITE_GITHUB_USERNAME ?? 'Sathvik-KS',

  /** Optional GitHub personal access token for higher API rate limits (keep secret!). */
  githubToken: import.meta.env.VITE_GITHUB_TOKEN as string | undefined,

  /** Base URL of the Django REST API backend. */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000',
} as const;