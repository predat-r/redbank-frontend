/**
 * Mock data conforming exactly to docs/openapi.json DTO schemas:
 * - AccountHolderDto
 * - BalanceDto
 * - BankTransactionDto
 */

export const mockAccountHolder = {
  id: 101,
  userId: 1,
  accountNumber: 'RB-8492048192',
  currency: 'USD',
  accountStatus: 'ACTIVE',
  approvedAt: '2026-01-15T09:00:00Z',
  createdAt: '2026-01-14T10:00:00Z',
  updatedAt: '2026-01-15T09:00:00Z',
};

export const mockLatestBalance = {
  id: 501,
  accountHolderId: 101,
  transactionId: 1008,
  entryDate: '2026-08-05T14:30:00Z',
  amount: 2500.0,
  indicator: 'CREDIT',
  runningBalance: 42850.75,
};

export const mockUserProfile = {
  name: 'Alexander Wright',
  email: 'alexander.wright@example.com',
  role: 'ROLE_ACCOUNT_HOLDER',
};

export const mockTransactions = [
  {
    id: 1008,
    transactionReference: 'TXN-984201948210',
    sourceAccountNumber: 'EXT-ACC-99210',
    destinationAccountNumber: 'RB-8492048192',
    type: 'DEPOSIT',
    description: 'Monthly Payroll Deposit - Acme Corp',
    amount: 5400.0,
    status: 'COMPLETED',
    createdAt: '2026-08-05T14:30:00Z',
    completedAt: '2026-08-05T14:30:00Z',
  },
  {
    id: 1007,
    transactionReference: 'TXN-881203948112',
    sourceAccountNumber: 'RB-8492048192',
    destinationAccountNumber: 'RB-3920194821',
    type: 'TRANSFER',
    description: 'Rent Payment - Crestview Apartments',
    amount: 1850.0,
    status: 'COMPLETED',
    createdAt: '2026-08-03T11:15:00Z',
    completedAt: '2026-08-03T11:15:05Z',
  },
  {
    id: 1006,
    transactionReference: 'TXN-773019284019',
    sourceAccountNumber: 'RB-8492048192',
    destinationAccountNumber: 'ATM-LOC-402',
    type: 'WITHDRAWAL',
    description: 'ATM Cash Withdrawal - Main St Branch',
    amount: 200.0,
    status: 'COMPLETED',
    createdAt: '2026-08-01T16:45:00Z',
    completedAt: '2026-08-01T16:45:02Z',
  },
  {
    id: 1005,
    transactionReference: 'TXN-664019283711',
    sourceAccountNumber: 'RB-8492048192',
    destinationAccountNumber: 'RB-1029384756',
    type: 'TRANSFER',
    description: 'Wire Transfer to Sophia Wright',
    amount: 750.0,
    status: 'PENDING',
    createdAt: '2026-07-30T09:20:00Z',
    completedAt: null,
  },
  {
    id: 1004,
    transactionReference: 'TXN-551029384712',
    sourceAccountNumber: 'EXT-ACC-11029',
    destinationAccountNumber: 'RB-8492048192',
    type: 'DEPOSIT',
    description: 'Freelance Design Retainer - TechFlow Ltd',
    amount: 3050.0,
    status: 'COMPLETED',
    createdAt: '2026-07-28T13:10:00Z',
    completedAt: '2026-07-28T13:10:00Z',
  },
  {
    id: 1003,
    transactionReference: 'TXN-449102938481',
    sourceAccountNumber: 'RB-8492048192',
    destinationAccountNumber: 'RB-9920192837',
    type: 'TRANSFER',
    description: 'Utility Bill Payment - Metro Electric',
    amount: 145.5,
    status: 'COMPLETED',
    createdAt: '2026-07-25T17:05:00Z',
    completedAt: '2026-07-25T17:05:02Z',
  },
  {
    id: 1002,
    transactionReference: 'TXN-338201948291',
    sourceAccountNumber: 'RB-8492048192',
    destinationAccountNumber: 'RB-5520192834',
    type: 'TRANSFER',
    description: 'Online Transfer - Failed Fraud Check',
    amount: 12500.0,
    status: 'CANCELLED',
    createdAt: '2026-07-20T22:14:00Z',
    completedAt: null,
  },
];
