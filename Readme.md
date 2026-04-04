Playwright Test Suite for ExpandTesting.com Notes App

This repository contains automated tests for the ExpandTesting Notes App using Playwright JS. It demonstrates a combination of API testing, UI testing, and network interception techniques.


Table of Contents
Test Overview
Setup
Test Structure
How to Run Tests
Key Notes

Test Overview
This suite demonstrates several test scenarios:

1. API-Only Automated Tests
Login via the API
Authenticate using token
Get Notes via API
Validate responses (status, data, messages)

2. UI-Only Automated Tests
Login via UI
Create a note via the UI
Verify the note appears correctly in the UI
Delete the note via UI
Verify deletion

3. Network Intercept Tests
a) No Notes Scenario
Intercept GET notes request
Return an intercepted empty notes response
Verify UI reflects zero notes

b) Two Notes Scenario
Intercept GET notes request
Return an intercepted response with two notes
Verify UI displays both notes

4. Combined API + UI Tests
Login via API, get the auth. token and use throughout.
Create a note via API
Verify that the note appears in the UI
Delete the created note via API
Verify that the note is removed from the UI

Setup
1. Clone this repository:
git clone <repo-url>

2. Install dependencies:
npm install
Install Playwright browsers:
npx playwright install

Test Structure

API only tests        # API-only tests: login, get notes
UI only tests         # UI-only tests: create, verify creation, delete, verify note deleted.
Network-intercept tests # Network intercept tests: fake responses
API + UI combined tests   # Combined API + UI tests

How to Run Tests

Run all tests:
npx playwright test


Key Notes
Authentication: API login responses return a token which is required for API requests.
Data Handling: Some tests use network interception to simulate API responses.
UI Validation: UI tests verify that notes are displayed, created, or deleted as expected.
Reusable Tokens: For API + UI combined tests, the token from API login can be reused in network requests.
End-to-End Flow: The suite demonstrates full E2E flows — creating notes via API and verifying in UI, as well as deleting them via API and verifying removal in UI.


This repo is a showcase of Playwright's API, UI, and network interception capabilities, combining them to create robust end-to-end test scenarios for the Notes app.

