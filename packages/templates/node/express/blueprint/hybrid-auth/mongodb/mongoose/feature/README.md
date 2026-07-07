# Hybrid Auth MongoDB Feature

Minimal Node.js + Express + TypeScript Feature starter using MongoDB and hybrid authentication (local and OAuth via Passport or similar).

## Features

- Express + TypeScript Feature structure
- MongoDB integration
- Hybrid auth: local credentials and OAuth providers (e.g., Google, GitHub)
- Session-based authentication compatible with production
- Environment-driven configuration with `.env`
- Dev and production scripts

## What This Provides

- A clean starting point for credential and OAuth login
- Prewired Express app with routing and session middleware
- MongoDB connection wiring ready for your data models
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
- MongoDB (local or Atlas)

## Scripts

- `npm run dev` — start development server
- `npm run build` — compile TypeScript
- `npm start` — start compiled app

## Notes

- Never commit `.env` or secrets.
- Ensure indexes and users collections exist if your auth flow relies on them.
