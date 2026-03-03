/**
 * Playwright — "The Modern Standard"
 *
 * Demonstrates:
 * - Semantic locators: getByRole, getByLabel, getByTestId — self-documenting
 * - No POM needed — locators are so expressive the flat file reads clearly
 * - Auto-wait on every action — no manual waits anywhere
 * - Built-in assertions with auto-retry (expect + toBeVisible, toHaveText)
 * - Multi-browser support, tracing, codegen
 */

import { test, expect } from '@playwright/test'

test('full checkout flow', async ({ page }) => {
  await page.goto('/')

  // --- Step 1: Contact Information ---
  await page.getByLabel('First Name').fill('Jane')
  await page.getByLabel('Last Name').fill('Smith')
  await page.getByLabel('Email').fill('jane@example.com')
  await page.getByLabel('Phone').fill('555-123-4567')
  await page.getByRole('button', { name: 'Next' }).click()

  // --- Step 2: Select Pro Plan ---
  await page.getByTestId('plan-pro').click()
  await expect(page.getByTestId('plan-pro')).toHaveClass(/plan-card--selected/)
  await page.getByRole('button', { name: 'Next' }).click()

  // --- Step 3: Company Information ---
  await page.getByLabel('Company Name').fill('Acme Corp')
  await page.getByLabel('Company Type').selectOption('LLC')
  await page.getByLabel('State of Formation').selectOption('Delaware')
  await page.getByRole('button', { name: 'Next' }).click()

  // --- Step 4: Review Order ---
  await expect(page.getByTestId('review-name')).toHaveText('Jane Smith')
  await expect(page.getByTestId('review-email')).toHaveText('jane@example.com')
  await expect(page.getByTestId('review-plan-name')).toHaveText('Pro')
  await expect(page.getByTestId('review-companyName')).toHaveText('Acme Corp')
  await expect(page.getByTestId('review-companyType')).toHaveText('LLC')
  await expect(page.getByTestId('review-companyState')).toHaveText('Delaware')
  await page.getByRole('button', { name: 'Proceed to Payment' }).click()

  // --- Step 5: Payment ---
  await page.getByLabel('Name on Card').fill('Jane Smith')
  await page.getByLabel('Card Number').fill('4111111111111111')
  await page.getByLabel('Expiry').fill('12/28')
  await page.getByLabel('CVV').fill('123')
  await page.getByLabel('Billing ZIP').fill('90210')
  await page.getByRole('button', { name: 'Pay Now' }).click()

  // --- Step 6: Confirmation ---
  await expect(page.getByTestId('confirmation')).toBeVisible({ timeout: 15000 })
  await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible()
  await expect(page.getByTestId('order-id')).toContainText('ORD-')
})
