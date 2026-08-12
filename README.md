# RedBank Frontend

React frontend for the RedBank banking application, built with Vite, Tailwind CSS, React Query, and React Router.

## Features and views

### Account holder

- Dashboard with current balance and recent activity
- Transfers and withdrawals
- Transaction history and transaction details
- Profile and security settings
- Registration status tracking
- Support chat

### Administrator

- Admin overview dashboard
- Registration approvals and rejections
- User and account-holder management
- Account balance and ledger views
- Deposit creation
- Transaction search, review, and approval actions
- Audit log viewer

Authentication is protected by role-based routing. Refresh-token and CSRF-cookie handling keep authenticated sessions working across page refreshes.

## Requirements

- Node.js 22 or newer
- npm
- RedBank backend running locally or at a configured API URL

## Setup

```bash
npm install
cp .env.example .env.local
```

Update `.env.local` when needed:

```env
VITE_PORT=3001
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the development server:

```bash
npm run dev
```

The app is available at [http://localhost:3001](http://localhost:3001).

## Common commands

```bash
npm run build          # Create a production build
npm run preview        # Preview the production build
npm run test:run       # Run tests once
npm run test           # Run tests in watch mode
npm run lint           # Check ESLint rules
npm run format:check   # Check Prettier formatting
```

## Backend requirements

The backend must allow requests from `http://localhost:3001`, allow credentials, and provide the authentication and account APIs under `/api`. Authentication uses HTTP cookies for refresh and CSRF tokens, so cookies and CSRF headers must be configured correctly on the backend.

## CI

GitHub Actions runs formatting, linting, tests, and the production build on pushes and pull requests. It can also be started manually from the **Actions** tab using the **Frontend CI** workflow.
