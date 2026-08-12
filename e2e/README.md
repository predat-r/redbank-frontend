# End-to-end tests

Selenium + Cucumber tests for the main RedBank user journeys.

```text
e2e/
├── features/
│   ├── auth/          # Login, registration, refresh, and logout
│   ├── transactions/  # Transfers, withdrawals, and transaction history
│   ├── admin/         # Admin dashboards, users, accounts, and ledger
│   ├── profile/       # Profile and security settings
│   └── chatbot/       # Support chatbot journeys
└── support/
    ├── pages/         # Shared Selenium page objects
    ├── steps/         # Shared step definitions
    ├── hooks.js       # Browser setup and teardown
    └── world.js       # Scenario context
```

Feature files should describe user behavior. Selenium selectors and browser mechanics belong in `support/pages`, while reusable step definitions belong in `support/steps`.

## Running the tests

Start the frontend and backend, then provide a test account:

```bash
cp .env.e2e.example .env.e2e
# Edit .env.e2e with a valid account-holder test user
npm run test:e2e
```

Optional environment variables:

```bash
FRONTEND_URL=http://localhost:3001
BROWSER=chrome
HEADLESS=true # optional; browser is visible by default
```

`.env.e2e` is ignored by Git and should never contain production credentials.
