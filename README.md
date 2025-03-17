# Hacker News Angular Client

## Overview

This Angular application is a client for my [Hacker News Web REST API](https://github.com/agustindangelo/hacker-news-api), designed to allow users to search and view stories. The app is built with a focus on scalability and performance, utilizing server-side search filtering and pagination to efficiently handle large datasets.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/agustindangelo/hacker-news-client.git 
   cd hacker-news-client
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

   The application will be available at `http://localhost:4200`.

## Playwright E2E Tests

This project includes end-to-end tests using Playwright, located in the `e2e` folder.

To run the Playwright tests:

1. Install Playwright dependencies:
   ```bash
   npx playwright install
   ```

2. Run the tests:
   ```bash
   npm run test:e2e
   ```