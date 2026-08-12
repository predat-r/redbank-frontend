Feature: User registration

  Scenario: User cannot submit an empty registration form
    Given the user is on the registration page
    When the user submits the empty registration form
    Then the registration validation errors should be displayed
