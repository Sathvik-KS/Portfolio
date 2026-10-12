# Portfolio

A personal portfolio web application with a **React + TypeScript** frontend and a **Django REST Framework** backend.

The site presents a short introduction, an about page, and a projects section populated live from my public GitHub repositories. A small Django backend is included and exposes a `Project` REST API managed through the Django admin.

## Features

- **Home** (`/`) — intro section plus a live list of GitHub repositories fetched from the GitHub REST API.
- **Projects** (`/projects`) — up to five GitHub repositories shown as cards with description, star count, and primary language.
- **Repository detail** (`/projects/:name/`) — details for a single GitHub repository (description, stars, language, size) with a link to GitHub.
- **About** (`/about`) — short bio.
- **Shared navigation** across all pages (Home, About, Projects).
- **Django REST API** — a `Project` model with CRUD endpoints at `/api/projects/`. Anonymous users can read; only authenticated users can create or modify.
- **Django admin** at `/admin/` for managing projects.
- Loading and error states for every data-driven view.

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite 8, React Router 7 |
| Linting | ESLint (flat config) with typescript-eslint and the React hooks/refresh plugins |
| Backend | Django 6, Django REST Framework 3.17, django-cors-headers |
| Database | SQLite (development) |

## Architecture and repository structure

```
Portfolio/
├── backend/                   Django project
│   ├── backend/               Project settings, root URLs, WSGI/ASGI
│   ├── projects/              "projects" app: models, serializers, views, API URLs, tests
│   ├── manage.py
│   └── requirements.txt
└── frontend/                  React + TypeScript (Vite) app
    ├── public/                Static assets (favicon, icons)
    ├── src/
    │   ├── Components/        Pages and UI components
    │   │   ├── Home.tsx, About.tsx, ProjectList.tsx, RepoDetail.tsx, Nav.tsx, Card.tsx
    │   │   ├── useGithubRepos.tsx   hook: fetch repositories from GitHub
    │   │   └── useProjects.tsx      hook: fetch the Django projects API (available, not used by the UI yet)
    │   ├── App.tsx, main.tsx
    │   └── index.css
    └── package.json
```

> **Note:** The current UI reads repository data directly from the public GitHub REST API. The Django `projects` API is fully functional and can be wired into the frontend through `useProjects.tsx` if you would rather serve project data from your own database.

## Prerequisites

- **Node.js 20.19+ or 22.12+** and npm
- **Python 3.12+** and pip
- Git

## Backend setup (Django)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # optional, for the admin
python manage.py runserver
```

The backend runs at http://127.0.0.1:8000/.

## Frontend setup (React)

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at http://localhost:5173/.

## Environment variables

The backend runs with development-safe defaults, so no variables are required locally. Override these for non-local environments:

| Variable | Purpose | Default |
|----------|---------|---------|
| `DJANGO_SECRET_KEY` | Django secret key | development-only key in `settings.py` |
| `DJANGO_DEBUG` | Enable debug mode | `True` |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated allowed hosts | empty (localhost only) |

No environment variables are required for the frontend.

## Database setup and migrations

The backend uses SQLite (`backend/db.sqlite3`) by default. The database file is created automatically and is excluded from Git.

```bash
cd backend
python manage.py migrate
```

## API

Base URL: `http://127.0.0.1:8000/api/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/` | List projects |
| POST | `/api/projects/` | Create a project (authenticated only) |
| GET | `/api/projects/{id}/` | Retrieve a project |
| PUT / PATCH | `/api/projects/{id}/` | Update a project (authenticated only) |
| DELETE | `/api/projects/{id}/` | Delete a project (authenticated only) |

A project has the fields `id`, `title`, `description`, `github_link`, and `created_at`.

## Commands

Frontend (`frontend/`):

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

Backend (`backend/`):

| Command | Description |
|---------|-------------|
| `python manage.py runserver` | Start the Django dev server |
| `python manage.py migrate` | Apply database migrations |
| `python manage.py test` | Run the test suite |
| `python manage.py check` | Run Django system checks |

## Known limitations

- GitHub repository data is fetched anonymously, so it is subject to GitHub's unauthenticated rate limit (60 requests per hour per IP).
- CORS is configured for `http://localhost:5173` and `http://127.0.0.1:5173` only.
- SQLite is used for development and is not intended for production traffic.
- The Django projects API is not currently consumed by the UI.

## Deployment notes

- Set `DJANGO_DEBUG=False`, a real `DJANGO_SECRET_KEY`, and `DJANGO_ALLOWED_HOSTS` for production.
- Add the deployed frontend origin to `CORS_ALLOWED_ORIGINS`.
- Configure `STATIC_ROOT` and run `python manage.py collectstatic` if Django serves static files.
- Point the frontend at the deployed API and re-enable `useProjects.tsx` if you want project data served from Django.
