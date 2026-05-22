# SmartStore AI

SmartStore AI is a full-stack AI e-commerce admin assistant for managing products, inventory, analytics, AI content generation, and AI-powered business recommendations. It is built as a SaaS-style admin dashboard with protected routes, MongoDB-backed data, Gemini AI integration, smart inventory alerts, analytics dashboards, dark/light mode, animations, and production-focused backend hardening.

The project is split into:

- `frontend/`: React + Vite admin dashboard
- `backend/`: Express + MongoDB API server
- root `package.json`: convenience scripts for installing, running, and building both apps

## Tech Stack

**Frontend**

- React 18
- Vite
- Tailwind CSS
- Axios
- React Router
- Framer Motion
- Lucide React
- Chart.js + react-chartjs-2

**Backend**

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- express-validator
- Helmet
- CORS
- Morgan
- Compression
- express-rate-limit
- dotenv

**AI**

- Google Gemini API through `@google/genai`
- Default model: `gemini-2.5-flash-lite`

## What The App Does

SmartStore AI gives an ecommerce admin team one place to:

- Sign up, log in, and maintain a JWT-backed session
- Manage products with full CRUD
- Track inventory health
- Detect low-stock and out-of-stock products
- Generate restock recommendations
- View revenue, product, category, and inventory analytics
- Generate AI product copy with Gemini
- Generate AI business intelligence recommendations from real product/inventory signals
- Use a polished SaaS UI with responsive layout, theme switching, transitions, skeleton loaders, and toast notifications

## High-Level Architecture

```text
Browser
  |
  | React + Axios
  v
Frontend Vite App
  |
  | HTTP /api/*
  v
Express Backend
  |
  | Mongoose
  v
MongoDB

Express Backend
  |
  | @google/genai
  v
Gemini API
```

The frontend never talks directly to MongoDB or Gemini. It only calls the Express API. The backend validates requests, authenticates protected routes, queries MongoDB, calls Gemini where needed, and returns standardized JSON responses.

## Project Structure

```text
SmartStore/
  backend/
    src/
      ai/
      analytics/
      config/
      controllers/
      inventory/
      middleware/
      models/
      routes/
      services/
      utils/
      validations/
      app.js
      server.js
    .env
    .env.example
    package.json

  frontend/
    src/
      api/
      charts/
      components/
      context/
      layouts/
      pages/
      styles/
      App.jsx
      main.jsx
    package.json

  package.json
  README.md
```

## Core Backend Flow

1. `backend/src/server.js` starts the server and connects to MongoDB.
2. `backend/src/app.js` creates the Express app.
3. Security middleware is applied first:
   - Helmet
   - CORS whitelist
   - Compression
   - JSON/body limits
   - request sanitization
   - Morgan logging
   - API rate limiting
4. Routes are mounted under `/api`.
5. Protected routes use `requireAuth`.
6. Controllers call service/model logic.
7. Errors flow into centralized error middleware.
8. Responses use a consistent structure.

Success response:

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## Core Frontend Flow

1. `frontend/src/main.jsx` mounts React.
2. Providers wrap the app:
   - `ThemeProvider`
   - `ToastProvider`
   - `BrowserRouter`
   - `AuthProvider`
3. `App.jsx` defines public and protected routes.
4. Auth state is stored in localStorage and synced into Axios headers.
5. Protected pages render inside `DashboardLayout`.
6. Shared UI components provide page transitions, toasts, theme toggle, skeletons, cards, tables, and modals.

## Main Pages

```text
/auth         Signup and login
/dashboard    Overview and backend health
/products     Product CRUD and filtering
/analytics    Revenue, product, category, and inventory analytics
/inventory    Inventory monitoring, alerts, and restock recommendations
/ai-insights  Gemini-powered business intelligence dashboard
/assistant    Gemini-powered product content generation
/settings     Settings page
```

## Authentication

Authentication is handled with:

- `User` model in MongoDB
- bcrypt password hashing
- JWT tokens
- protected backend middleware
- protected React routes
- session restoration through `/api/auth/me`

Important files:

```text
backend/src/models/User.js
backend/src/routes/auth.routes.js
backend/src/middleware/auth.middleware.js
frontend/src/context/AuthContext.jsx
frontend/src/components/auth/ProtectedRoute.jsx
frontend/src/components/auth/PublicOnlyRoute.jsx
```

## Product Management

Products are stored in MongoDB using the `Product` model.

Product fields:

- `name`
- `description`
- `category`
- `price`
- `stock`
- `image`
- `status`
- timestamps

Important files:

```text
backend/src/models/Product.js
backend/src/controllers/product.controller.js
backend/src/routes/products.routes.js
backend/src/validations/product.validation.js
frontend/src/pages/ProductsPage.jsx
frontend/src/components/products/ProductTable.jsx
frontend/src/components/products/ProductFormModal.jsx
```

Features:

- Create products
- Edit products
- Delete products
- Filter by search, category, and status
- Validate all product input
- Show loading, empty, and error states
- Toast feedback on create/update/delete

## Inventory Monitoring

Inventory is derived from product `stock`.

Inventory status rules:

- `In Stock`: `stock > 20`
- `Low Stock`: `stock >= 1 && stock <= 20`
- `Out of Stock`: `stock === 0`

Important files:

```text
backend/src/inventory/stockAnalyzer.js
backend/src/inventory/alertGenerator.js
backend/src/inventory/restockEngine.js
backend/src/inventory/inventoryService.js
backend/src/controllers/inventoryController.js
backend/src/routes/inventoryRoutes.js
frontend/src/pages/Inventory.jsx
frontend/src/components/inventory/
```

Features:

- Inventory overview cards
- Low-stock table
- Out-of-stock monitoring
- Smart alerts
- Restock recommendations
- Most stocked products
- Least stocked products
- Inventory search and status filters
- Inventory quantity update API

## Analytics

Analytics are generated from product data using MongoDB aggregation. There is no fake orders collection. Revenue-like values are calculated as an inventory-value proxy using:

```text
price * stock
```

Important files:

```text
backend/src/analytics/analyticsService.js
backend/src/analytics/revenueAnalytics.js
backend/src/analytics/productAnalytics.js
backend/src/analytics/inventoryAnalytics.js
backend/src/controllers/analyticsController.js
backend/src/routes/analytics.routes.js
frontend/src/pages/AnalyticsPage.jsx
frontend/src/charts/
```

Analytics include:

- Summary metrics
- Revenue trend proxy
- Product performance
- Category distribution
- Inventory health
- Top products

## Gemini AI Product Content Generation

The AI assistant generates ecommerce content from verified product inputs.

Supported content types:

- Product description
- SEO tags
- Marketing caption
- Product highlights
- Product summary

Important files:

```text
backend/src/ai/geminiClient.js
backend/src/ai/aiService.js
backend/src/ai/promptTemplates.js
backend/src/ai/responseFormatter.js
backend/src/controllers/ai.controller.js
backend/src/routes/ai.routes.js
frontend/src/pages/AssistantPage.jsx
frontend/src/api/aiApi.js
```

How it works:

1. User enters product details in the assistant page.
2. Frontend sends a request to `/api/ai/generate/:type`.
3. Backend validates the request.
4. `promptTemplates.js` builds a safe prompt.
5. `aiService.js` calls Gemini with retry and timeout handling.
6. `responseFormatter.js` normalizes the response.
7. Frontend displays the result.

The prompts are designed to avoid unsupported claims. Gemini is instructed to use only supplied product details.

## AI Business Intelligence

AI Insights combines deterministic business metrics with Gemini-generated interpretation.

Important files:

```text
backend/src/ai/analyticsInterpreter.js
backend/src/ai/recommendationEngine.js
backend/src/ai/businessInsightsService.js
backend/src/ai/insightPromptTemplates.js
backend/src/services/recommendationService.js
backend/src/controllers/aiInsightsController.js
backend/src/routes/aiInsightsRoutes.js
frontend/src/pages/AIInsights.jsx
frontend/src/components/ai-insights/
```

How it works:

1. Backend reads real product, inventory, category, price, and stock data.
2. `analyticsInterpreter.js` creates structured business metrics.
3. `recommendationEngine.js` creates deterministic recommendation candidates.
4. `businessInsightsService.js` sends the metrics to Gemini using JSON output instructions.
5. If Gemini fails, the backend returns metric-based fallback insights instead of inventing data.
6. Frontend displays summary, pricing recommendations, inventory insights, trend insights, and revenue optimization ideas.

Important constraint:

- The system does not invent sales, customer behavior, margins, conversion rates, or seasonal data that does not exist in the database.

## UI/UX System

The frontend includes a reusable SaaS UI layer.

Important files:

```text
frontend/src/context/ThemeContext.jsx
frontend/src/components/ui/ThemeToggle.jsx
frontend/src/components/ui/Toast.jsx
frontend/src/components/ui/PageTransition.jsx
frontend/src/components/ui/LoadingSkeleton.jsx
frontend/src/components/ui/AnimatedButton.jsx
frontend/src/components/ui/AnimatedCard.jsx
frontend/src/components/ui/EmptyState.jsx
frontend/src/components/ui/ErrorState.jsx
frontend/src/components/animations/
frontend/src/layouts/DashboardLayout.jsx
frontend/src/components/layout/Navbar.jsx
frontend/src/components/layout/Sidebar.jsx
```

Features:

- Dark/light mode
- Persistent theme state in localStorage
- Toast notifications
- Smooth page transitions
- Animated cards
- Animated modals
- Loading skeletons
- Responsive dashboard shell
- Mobile sidebar

## Backend Security And Hardening

Important files:

```text
backend/src/middleware/securityMiddleware.js
backend/src/middleware/rateLimiter.js
backend/src/middleware/errorMiddleware.js
backend/src/middleware/notFoundMiddleware.js
backend/src/middleware/validateRequest.js
backend/src/middleware/asyncHandler.js
backend/src/utils/ApiError.js
backend/src/utils/ApiResponse.js
backend/src/utils/logger.js
backend/src/config/corsConfig.js
backend/src/config/securityConfig.js
```

Security features:

- Helmet secure headers
- CORS whitelist
- API rate limiting
- Auth route rate limiting
- Request body limits
- Request sanitization for Mongo operator keys and script-like strings
- Centralized error handling
- Production-safe error messages
- Validation error formatting
- Morgan request logging
- Compression middleware

## API Overview

Base URL:

```text
http://localhost:5000/api
```

### Health

```text
GET /api/health
```

### Auth

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Products

Protected:

```text
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Inventory

Protected:

```text
GET   /api/inventory
GET   /api/inventory/summary
GET   /api/inventory/statistics
GET   /api/inventory/low-stock
GET   /api/inventory/out-of-stock
GET   /api/inventory/alerts
GET   /api/inventory/restock-recommendations
PATCH /api/inventory/:id/quantity
```

### Analytics

Protected:

```text
GET /api/analytics
GET /api/analytics/dashboard
GET /api/analytics/revenue
GET /api/analytics/products
GET /api/analytics/inventory
```

### AI Content

```text
POST /api/ai/generate/:type
```

Supported `type` values:

```text
description
seoTags
caption
highlights
summary
```

### AI Business Insights

Protected:

```text
GET /api/ai-insights
```

Optional query:

```text
forceAI=true
```

### Assistant Demo Endpoint

Protected:

```text
GET  /api/assistant/insights
POST /api/assistant/ask
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`.

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_TIMEOUT_MS=30000

JSON_BODY_LIMIT=1mb
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=30
```

Frontend API base URL is optional. If needed, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Installation

Install everything from the root:

```bash
npm run install:all
```

Or install each app manually:

```bash
npm install --prefix backend
npm install --prefix frontend
```

## Running In Development

Start both frontend and backend:

```bash
npm run dev
```

Default URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
API:      http://localhost:5000/api
```

Run only backend:

```bash
npm run dev --prefix backend
```

Run only frontend:

```bash
npm run dev --prefix frontend
```

## Build

Build the frontend:

```bash
npm run build
```

Start the backend:

```bash
npm start
```

## How To Use The App

1. Start MongoDB or configure MongoDB Atlas in `MONGO_URI`.
2. Add a secure `JWT_SECRET`.
3. Add a valid `GEMINI_API_KEY`.
4. Start the app with `npm run dev`.
5. Open `http://localhost:5173`.
6. Sign up for an account.
7. Add products from the Products page.
8. Visit Inventory to see stock states and restock suggestions.
9. Visit Analytics to see aggregated product metrics.
10. Visit AI Assistant to generate product copy.
11. Visit AI Insights to generate business recommendations.

## Important Implementation Notes

- Product analytics are based on product and inventory data.
- Revenue-like metrics are inventory-value proxies, not confirmed order revenue.
- AI prompts are constrained to avoid unsupported business claims.
- AI business insights fall back to deterministic recommendations if Gemini fails.
- Protected APIs require a JWT token.
- The backend can return fallback demo inventory in some read-only paths when MongoDB is offline, but product CRUD and authentication require MongoDB.

## Troubleshooting

### Backend is not reachable

Check that the backend is running:

```bash
npm run dev --prefix backend
```

Then open:

```text
http://localhost:5000/api/health
```

### CORS origin is not allowed

Set `CLIENT_URL` in `backend/.env` to your frontend URL:

```env
CLIENT_URL=http://localhost:5173
```

For multiple origins, use comma-separated values:

```env
CLIENT_URL=http://localhost:5173,http://localhost:4173
```

### Authentication fails

Check:

- `JWT_SECRET` is set
- MongoDB is connected
- token exists in browser localStorage
- backend `/api/auth/me` returns the current user

### Gemini content generation fails

Check:

- `GEMINI_API_KEY` is valid
- `GEMINI_MODEL=gemini-2.5-flash-lite`
- backend has network access
- Gemini quota/rate limits

### MongoDB connection fails

Check:

- `MONGO_URI` is correct
- Atlas IP access list allows your IP
- username/password are valid
- database user has read/write permissions

### Rate limit errors

Tune these values:

```env
RATE_LIMIT_MAX=300
AUTH_RATE_LIMIT_MAX=30
```

### Vite build chunk warning

The app may show a Vite chunk-size warning after build. This is not a build failure. It can be optimized later with manual chunks or route-level code splitting.

## Useful Commands

```bash
# Install backend and frontend dependencies
npm run install:all

# Run both apps in development
npm run dev

# Build frontend
npm run build

# Start backend in production-style mode
npm start

# Run backend only
npm run dev --prefix backend

# Run frontend only
npm run dev --prefix frontend
```

## Current Development Status

Implemented phases include:

- Project setup and dashboard shell
- Authentication
- Product management
- Analytics dashboard
- Gemini product content generation
- AI business intelligence
- Inventory monitoring and smart alerts
- Advanced SaaS UI/UX polish
- Backend security, optimization, and production hardening

## Security Reminder

Do not commit real secrets. Keep these values private:

- `MONGO_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`

If a real secret was ever committed or shared, rotate it immediately.
