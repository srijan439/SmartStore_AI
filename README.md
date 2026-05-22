# SmartStore AI

AI-powered e-commerce admin dashboard built phase by phase.

## Phase 1

Project initialization, scalable frontend/backend structure, Tailwind setup, MongoDB connection utility, Express health API, React routing, responsive dashboard layout, sidebar, navbar, and frontend-backend connection check.

## Phase 2+

Working commerce admin slices are now available: product APIs and creation UI, inventory alerts, analytics summary and revenue chart, AI assistant insights, and dashboard navigation for each area. The API can start even when MongoDB is unavailable, so the local dashboard stays usable while database connectivity is configured.

## Authentication

The app now includes signup, login, JWT session storage, protected React dashboard routes, protected commerce APIs, `/api/auth/me` session validation, and a navbar logout action. User accounts are currently stored in memory for local development; connect the auth data layer to MongoDB before production use.
