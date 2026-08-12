Feature: RedAssist Chatbot

  Background:
    Given the user is logged in with valid credentials
    And the user is on the chat page with a fresh session

  Scenario: Verify the empty chat state
    Then the chat area should be empty with a welcome message
    And the send button should be disabled when the input is empty
    And the clear chat button should be disabled

  Scenario: Send a basic message
    When the user types "Hello, what is my balance?" and submits
    Then the user's message should appear in the chat history
    And the RedAssist bot should respond with a message

  Scenario: Chat history persists across page reloads
    Given the user has sent a message "Hello" and received a reply
    When the user refreshes the page
    Then the previous messages should still be visible in the chat history

  Scenario: Clearing the chat history
    Given the user has sent a message "Hello" and received a reply
    When the user clicks the clear chat button
    Then the chat area should be empty with a welcome message
