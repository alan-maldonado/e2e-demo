# E2E Demo — Multi-Step Checkout Flow

Demo checkout app showcasing the evolution of E2E testing, from Selenium to Stagehand. Simulates a business formation service.

## Tech Stack

- **Vite** + **Vue 3** (Composition API, `<script setup>`)
- **Vue Router 4** — step navigation
- **Pinia** — global order state
- **Plain CSS** — no frameworks

## Setup

```bash
npm install
npm run dev
```

## Flow

| Step | Route           | Description                                       |
|------|-----------------|---------------------------------------------------|
| 1    | `/`             | Contact Info (name, email, phone)                 |
| 2    | `/plan`         | Plan Selection (Basic $0, Pro $199, Premium $349) |
| 3    | `/company`      | Company Info (name, type, state)                  |
| 4    | `/review`       | Order Review (summary with "Edit" links)          |
| 5    | `/payment`      | Payment (fake card + 1s simulated delay)          |
| 6    | `/confirmation` | Confirmation (order ID + "Start New Order" button)|

## E2E Testing Features

- `data-testid` on all interactive elements (e.g. `input-email`, `btn-next`, `plan-pro`)
- Validation errors use `role="alert"` for accessibility
- Payment has a 1-second delay to test wait/polling strategies
- Navigation guard prevents skipping steps
- Semantic HTML (`<form>`, `<label>`, `<button type="submit">`)
- `store.$reset()` to clear state between test runs
