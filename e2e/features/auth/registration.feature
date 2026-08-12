Feature: User registration

  Scenario: User submits a valid registration
    Given the user is on the registration page
    When the user submits valid registration details
    Then the registration should be shown as under review

  Scenario: Pending applicant is taken to registration status
    Given the user is on the registration page
    When the user submits valid registration details
    Then the registration status should be shown as under review

  Scenario: User cannot register with an invalid email address
    Given the user is on the registration page
    When the user submits registration details with an invalid email address
    Then the registration error "Enter a valid email address." should be displayed

  Scenario: User cannot register with a short password
    Given the user is on the registration page
    When the user submits registration details with a short password
    Then the registration error "Password must be between 8 and 100 characters." should be displayed

  Scenario: User cannot register with mismatched passwords
    Given the user is on the registration page
    When the user submits registration details with mismatched passwords
    Then the registration error "Passwords do not match." should be displayed

  Scenario: User must accept the terms before registering
    Given the user is on the registration page
    When the user submits otherwise valid registration details without accepting the terms
    Then the registration error "You must accept the terms to continue." should be displayed

  Scenario: User cannot register with an existing email address
    Given the user is on the registration page
    When the user submits registration details using an existing email address
    Then a registration error should be displayed

  @approval
  Scenario: Approved applicant can log in and access the dashboard
    Given the applicant is on the registration page
    When the applicant submits unique valid registration details
    And the admin approves the applicant registration
    And the approved applicant logs in
    Then the user should see the account dashboard

  Scenario: User cannot submit an empty registration form
    Given the user is on the registration page
    When the user submits the empty registration form
    Then the registration validation errors should be displayed
