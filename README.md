# KidStory Micro-Explainers MVP

This repository contains a minimal web-based PWA and Node.js backend for generating 30-40 second non-photorealistic micro-explainer videos for children aged 4-6.

## Directory Structure

- `frontend/` – React 18 + Vite PWA client
- `backend/` – Node.js 20 Express API server

## Setup

### Backend

```bash
cd backend
npm install
npm start # runs on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev # runs on http://localhost:5173
```

## Testing

Backend unit tests use Jest:

```bash
cd backend
npm test
```

## Compliance Notes

- COPPA: no ads, no child data stored
- Sessions verified via parent email magic link
- Privacy policy is hardcoded on the frontend

## Pilot Guide

1. Parent enters email to receive magic link (token is returned directly for demo).
2. Select topic, child name, and theme.
3. Generate video; view preview and QR code.
4. Submit thumbs-up/down feedback.
5. Metrics logged in-memory.

This MVP uses mocked AI/video generation services for local development.
