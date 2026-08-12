Feature: User login

  Scenario: User logs in with valid credentials
    Given the user is on the login page
    When the user logs in with valid credentials
    Then the user should see the account dashboard

  Scenario: User remains logged in after refreshing the page
    Given the user is logged in with valid credentials
    When the user refreshes the page
    Then the user should see the account dashboard

  Scenario: User logs out successfully
    Given the user is logged in with valid credentials
    When the user signs out
    Then the user should be returned to the login page

  Scenario: User cannot log in with invalid credentials
    Given the user is on the login page
    When the user submits invalid credentials
    Then a login error should be displayed

  Scenario: User cannot submit an empty login form
    Given the user is on the login page
    When the user submits the empty login form
    Then the login validation errors should be displayed

  Scenario: Unauthenticated user cannot access the dashboard
    Given the user opens the dashboard without logging in
    Then the user should be returned to the login page

  @admin
  Scenario: Admin user is redirected to the admin dashboard
    Given the admin user is on the login page
    When the admin user logs in with valid credentials
    Then the admin dashboard should be displayed
