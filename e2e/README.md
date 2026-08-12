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

## Transaction End-to-End Journeys (`e2e/features/transactions/`)

The transaction test suite covers end-to-end customer financial operations across transfers, cash withdrawals, and history ledgers:

- **Feature File**: `e2e/features/transactions/transactions.feature`
- **Page Object**: `e2e/support/pages/transactions.page.js`
- **Step Definitions**: `e2e/support/steps/transactions.steps.js`

### Scenarios Covered

1. **Fund Transfer Execution (`@transactions @transfer`)**:
   - Fills destination account, amount, category, and memo description.
   - Proceeds through the 3-step stepper (`Initiate` -> `Verify` -> `Receipt`).
   - Verifies completed or pending transaction receipt status.

2. **Validation & Limits (`@transactions @transfer @validation`)**:
   - Enforces required destination account numbers and minimum amount limits (`$0.01`).

3. **Cash Withdrawal Request (`@transactions @withdrawal`)**:
   - Switches to withdrawal mode, selects withdrawal method (ATM Cash Code / Branch), and submits request.

4. **Transaction History Filtering (`@transactions @history`)**:
   - Navigates to `/history`, applies type (`TRANSFER`, `DEPOSIT`) and status (`COMPLETED`, `PENDING`) filters.

5. **Receipt Modal Inspection (`@transactions @history @receipt`)**:
   - Clicks transaction ledger row and verifies details inside the `Transaction Receipt` modal.

## Running E2E Tests

### Headed Mode (`headless: false` - Visible Browser UI)

To launch tests with an interactive, visible Chrome browser window:

```bash
npm run test:e2e:headed
```

Or directly using the environment variable:

```bash
HEADLESS=false npx cucumber-js e2e/features/transactions/transactions.feature --import e2e/support/**/*.js
```

### Headless Mode (`headless: true` - CI / Background)

```bash
npm run test:e2e
```
