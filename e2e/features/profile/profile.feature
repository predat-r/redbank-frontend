Feature: Profile and Account Settings

  Background:
    Given the user is logged in with valid credentials
    And the user is on the profile page

  Scenario: View profile details
    Then the user should see their profile details

  Scenario: Update personal information
    When the user updates their personal information
    Then a success message should be displayed

  Scenario: Change account password
    When the user switches to the security tab
    And the user changes their password
    Then a success message should be displayed
    When the user reverts their password back to the original
    Then a success message should be displayed

  Scenario: Freeze account
    When the user freezes their account
    Then a success message should be displayed
    When the user unfreezes their account
    Then a success message should be displayed
