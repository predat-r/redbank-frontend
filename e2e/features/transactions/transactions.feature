Feature: Transaction Management
  As an authenticated RedBank account holder
  I want to transfer funds, make withdrawals, and review transaction history
  So that I can manage my account finances securely and track all ledger activities

  Background:
    Given I am logged in as an active account holder
    And I navigate to the "Transfers & Payments" page

  @transactions @transfer
  Scenario: Successfully initiate and complete a fund transfer
    When I fill in the transfer details:
      | destinationAccountNumber | RB1000000002                     |
      | amount                   | 150.00                           |
      | category                 | FOOD                             |
      | description              | Dinner bill split with colleague |
    And I click "Continue to Verification"
    Then I should see the transfer verification summary
    When I click "Confirm & Execute Transfer"
    Then I should see the transaction receipt with status "COMPLETED" or "PENDING"
    And the transaction reference code should be displayed

  @transactions @transfer @validation
  Scenario: Validate required destination account and amount limits
    When I fill in the transfer details:
      | destinationAccountNumber |                                  |
      | amount                   | 0                                |
    And I click "Continue to Verification"
    Then I should see an error message "Destination account number is required"
    And I should see an error message "Please enter a valid amount greater than 0"

  @transactions @withdrawal
  Scenario: Successfully initiate a cash withdrawal request
    Given I switch to the "Withdrawal Request" tab
    When I fill in the withdrawal details:
      | withdrawalMethod | ATM_CODE              |
      | amount           | 50.00                 |
      | category         | SHOPPING              |
      | description      | ATM cash out for trip |
    And I click "Continue to Verification"
    Then I should see the withdrawal verification summary
    When I click "Confirm & Execute Withdrawal"
    Then I should see the transaction receipt with status "COMPLETED" or "PENDING"

  @transactions @history
  Scenario: Filter transaction history by transaction type and status
    Given I navigate to the "Transaction History" page
    When I filter transaction history by:
      | type   | TRANSFER  |
      | status | COMPLETED |
    And I click "Apply Filters"
    Then the transaction history table should only display "TRANSFER" transactions

  @transactions @history @receipt
  Scenario: View transaction receipt details from history ledger
    Given I navigate to the "Transaction History" page
    When I click on the first transaction in the ledger table
    Then the "Transaction Receipt" modal should be displayed
    And I should see the transaction reference code and status badge
