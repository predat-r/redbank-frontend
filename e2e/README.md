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
