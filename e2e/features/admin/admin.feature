Feature: Admin workspace
  As an administrator
  I want to review the administration workspace
  So that I can manage RedBank operations from one place

  Background:
    Given the admin user is logged in with valid credentials

  Scenario: View the admin overview
    Then the admin overview should be displayed
    And the admin navigation should be displayed

  Scenario Outline: Open an admin workspace module
    When the admin user opens the "<module>" module
    Then the "<heading>" admin page should be displayed

    Examples:
      | module         | heading         |
      | Registrations  | Pending registrations |
      | Users          | Users           |
      | Account Holders| Account holders |
      | Deposits       | Deposits        |
      | Transactions    | Transactions    |
      | Audit Logs      | Audit logs      |

  Scenario: Open an account holder balance ledger
    When the admin user opens the "Account Holders" module
    And the admin user opens the first account balance
    Then the account balance page should be displayed
