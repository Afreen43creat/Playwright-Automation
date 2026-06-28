# Enterprise E-commerce Playwright Framework

JavaScript Playwright Test framework for e-commerce UI and API automation. It uses Page Object Model, reusable fixtures, JSON test data, environment configuration, reports, retries, parallel execution, and CI/CD.

## Tech Stack

- Playwright Test with JavaScript
- Page Object Model
- JSON test data management
- HTML and Allure reports
- GitHub Actions CI
- Tags: `@smoke`, `@regression`, `@sanity`

## Project Structure

```text
.
├── .github/workflows/playwright.yml
├── playwright.config.js
├── src
│   ├── config
│   ├── fixtures
│   ├── pages
│   ├── test-data
│   └── utils
└── tests
    ├── api
    └── ui
```

## Setup

```bash
npm install
npx playwright install
cp .env.example .env
```

Update `.env` when targeting real environments:

```text
TEST_ENV=dev
DEV_BASE_URL=https://www.saucedemo.com
STAGING_BASE_URL=https://staging.example.com
PROD_BASE_URL=https://www.example.com
API_BASE_URL=https://api.example.com
```

## Commands

```bash
npm test
npm run test:dev
npm run test:staging
npm run test:prod
npm run test:smoke
npm run test:regression
npm run test:sanity
npm run test:headed
npm run test:debug
npm run report
```

Generate and open Allure report:

```bash
npm run allure:generate
npm run allure:open
```

## Architecture

Page objects in `src/pages` own locators and user actions. Tests call business-readable methods such as `addProductToCart`, `fillShippingInformation`, and `expectOrderConfirmed`.

Fixtures in `src/fixtures/test-fixtures.js` provide shared capabilities:

- `testData` loads JSON data.
- `apiContext` creates API clients.
- `ecommerceContext` creates isolated browser contexts.
- `authenticatedPage` logs in once for tests that need a signed-in session.

Utilities in `src/utils` cover screenshots, waits, random user generation, logging, and custom assertions.

Environment configuration lives in `src/config/env.config.js` and is selected with `TEST_ENV=dev`, `TEST_ENV=staging`, or `TEST_ENV=production`.

## Implemented Coverage

- Login and logout
- Product search
- Product filtering
- Add and remove cart items
- Checkout process
- Order confirmation
- Coupon code validation
- Price validation across product, cart, and checkout pages
- Wishlist flow
- Inventory stock validation
- Product API validation
- Order API validation
- Mock payment API with route interception

## Reporting and Debug Artifacts

The framework captures:

- Trace: `retain-on-failure`
- Video: `retain-on-failure`
- Screenshot: `only-on-failure`
- HTML report: `playwright-report`
- Allure results: `allure-results`



