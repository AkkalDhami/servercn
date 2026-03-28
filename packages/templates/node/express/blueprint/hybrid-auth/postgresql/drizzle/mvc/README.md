# Hybrid Auth PostgreSQL MVC

Minimal Node.js + Express + TypeScript MVC starter using PostgreSQL, Drizzle ORM, and hybrid authentication (local and OAuth via Passport or similar).

## Features

- Express + TypeScript MVC structure
- PostgreSQL + Drizzle integration
- Hybrid auth: local credentials and OAuth providers (e.g., Google, GitHub, Facebook)
- Session-based authentication compatible with production
- Environment-driven configuration with `.env`
- Dev and production scripts

## What This Provides

- A clean starting point for credential and OAuth login
- Prewired Express app with routing and session middleware
- PostgreSQL connection wiring ready for your schema and data models
- TypeScript configuration and scripts for iterative dev and production builds
- Example environment keys you can enable as needed

## Quick Start

1. Install dependencies:
   - `npm install`
2. Configure environment:
   - Create `.env` (copy from `.env.example` if present).
   - Set variables shown below.
3. Run in development:
   - `npm run dev`
4. Build and run in production:
   - `npm run build`
   - `npm start`

## Requirements

- Node.js 18+
- PostgreSQL

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string for session storage
- `PORT` — server port (e.g., 3000)
- `NODE_ENV` — `development` or `production`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CRYPTO_SECRET`
- `EMAIL_FROM`, `RESEND_API_KEY`
- Optional OAuth (enable what you use):
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
  - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_REDIRECT_URI`
  - `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_REDIRECT_URI`

## Scripts

- `npm run dev` — start development server
- `npm run build` — compile TypeScript
- `npm start` — start compiled app

## Notes

- Never commit `.env` or secrets.
- Run your Drizzle migrations before starting the app.
