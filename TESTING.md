# Shoonya Frontend Testing

This document outlines the testing strategy, setup, and execution guidelines for frontend testing using Playwright. It covers end-to-end testing of the user interface for the web application Shoonya. This document is for developers, QA engineers and product managers.

### Technology Used

- TypeScript & JavaScript

### Test Environment Setup

1. Initialize Playwright into your project by running the following cmd in your root directory: npm init playwright@latest
2. Select according to your project how you want to keep the core installation settings as per project. Here’s a preferred list of settings:
   - Choose between TypeScript or JavaScript? (TypeScript)
   - Name of your Tests folder? (Tests)
   - Add a GitHub Actions workflow to easily run tests on CI? (Yes)
   - Install Playwright browsers (True/Yes)
3. Explain the configuration of playwright.config.ts (or .js), including:
   - Browser configurations (e.g., Chromium, Firefox, WebKit).
   - Base URL.
   - Test timeouts.
   - Reporter settings.
   - Any environment variables.
4. Add Environment Variables: Describe any environment variables used for different test environments (e.g., development, staging, production).

### Test Structure & Organisation

- **File Structure:** Describe the project's test directory structure. (e.g., tests/, tests/e2e/, tests/components/).
- **Test Naming Conventions:** Define the naming conventions for test files and test cases. (e.g., login.spec.ts, should_display_error_message).
- **Page Object Model (POM):** If using POM, explain its implementation and provide examples of page objects.
- **Fixtures:** Describe the usage of Playwright fixtures for setup and teardown of test environments.
- **Hooks:** Explain the usage of hooks such as before, after, beforeEach, and afterEach.

### Writing and Maintaining Tests

1. Use clear and descriptive names
2. Avoid Hardcoded Values
3. Use assertions effectively
4. Keep tests isolated
5. Use locators that are resilient to UI changes

### Examples

Here is an example on how playwright.config.ts file looks along with code comments
**![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfYZj71hXyX95OZDQHijqL1Y9KTihbc37GWoXdz4WwQw3v615W1ytZkUd215yUFwLjciF1lloeKJD4eosQCa8owILKIDbwT-weIAS8uQPbqUh1wUAc0DLh1iiLhXiXj9dh1FInvGg?key=k-Leo7lePn8Clef5UQ7x_d-r)**

Here is an example on how to write a basic test case
**![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXf_Qzz2ocSry2TRCpPP5DhCxH3_5t-TVfb3fW9qeplW130qrb22N0lNlD0HLoBtsbbbY4AThZNcI8Dr11rifWbwxyCGjUTsDioluKU8Mgz-Y8BS7ljXVj1lj4dBvxr84b1KVwI67g?key=k-Leo7lePn8Clef5UQ7x_d-r)**
