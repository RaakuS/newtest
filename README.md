# AI Grant Buddy MVP

This repository contains a minimal prototype for an AI-powered academic collaboration platform. The backend uses **FastAPI** with SQLite storage and integrates with Anthropic's Claude API for semantic matching. The frontend is a simple HTML/CSS/JS interface.

## File structure

```
backend/          FastAPI application and requirements
frontend/         Static frontend files
```

## Quick start

Run the `setup.sh` script to create a virtual environment and install Python
dependencies:

```bash
./setup.sh
```

This uses `backend/requirements.txt` and installs `pytest` for running tests.

After setup, activate the environment and run the API server:

```bash
export ANTHROPIC_API_KEY=<your key>
uvicorn backend.main:app --reload
```

Open `frontend/index.html` in a browser. Sign up with a username and interests and request matches.

The API key for Anthropic should be provided via the `ANTHROPIC_API_KEY` environment variable. A new SQLite database `app.db` will be created automatically.

## Deployment

1. Commit the repository to GitHub.
2. Provision a small server on a platform such as Fly.io, Render or Heroku.
3. Set the `ANTHROPIC_API_KEY` environment variable on the host and run the app using `uvicorn` or a process manager like `gunicorn`.
4. Serve the files in `frontend/` either via FastAPI static mount or a simple web host and map your DNS `aigrantbuddy.com` to the deployment.

A more advanced CI/CD pipeline can be added later, but this setup enables a rapid MVP launch within a day or two.

## Testing

Run tests with **pytest** after activating your virtual environment:

```bash
pytest
```

Recommended tests:

* **Unit tests** for FastAPI routes (see `tests/test_backend.py` as an example)
* **Integration tests** simulating a full signup and matchmaking flow
* **Frontend tests** (e.g. using a headless browser) to ensure UI elements load and API requests succeed

Use `python -m py_compile backend/main.py` to quickly check syntax.
