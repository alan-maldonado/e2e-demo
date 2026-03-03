/**
 * Puppeteer — "Chrome-Native"
 *
 * No WebDriver binary — talks directly to Chrome via CDP.
 * Improvements over Selenium:
 * - Simpler launch (no Builder pattern)
 * - Native async/await (no callback hell)
 * - page.type() and page.click() — cleaner API
 * - Introduces data-testid selectors — stable, decoupled from styling
 *
 * But still:
 * - Manual waits (waitForSelector)
 * - Chrome-only
 * - No built-in assertions
 */

import puppeteer from 'puppeteer'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'

// ---------------------------------------------------------------------------
// Selector dictionary — centralize all selectors in one place.
// If the UI changes, you update here instead of hunting through the test.
// This was the industry's first answer to selector chaos.
// With data-testid the selectors are stable, but the pattern stuck around.
// ---------------------------------------------------------------------------
const S = {
  // Contact
  formContact:    '[data-testid="form-contact"]',
  firstName:      '[data-testid="input-firstName"]',
  lastName:       '[data-testid="input-lastName"]',
  email:          '[data-testid="input-email"]',
  phone:          '[data-testid="input-phone"]',

  // Plan
  formPlan:       '[data-testid="form-plan"]',
  planPro:        '[data-testid="plan-pro"]',

  // Company
  formCompany:    '[data-testid="form-company"]',
  companyName:    '[data-testid="input-companyName"]',
  companyType:    '[data-testid="input-companyType"]',
  companyState:   '[data-testid="input-companyState"]',

  // Review
  reviewName:     '[data-testid="review-name"]',
  reviewEmail:    '[data-testid="review-email"]',
  reviewPlan:     '[data-testid="review-plan-name"]',
  reviewCompany:  '[data-testid="review-companyName"]',

  // Payment
  formPayment:    '[data-testid="form-payment"]',
  cardName:       '[data-testid="input-cardName"]',
  cardNumber:     '[data-testid="input-cardNumber"]',
  cardExpiry:     '[data-testid="input-cardExpiry"]',
  cardCvv:        '[data-testid="input-cardCvv"]',
  cardZip:        '[data-testid="input-cardZip"]',

  // Confirmation
  confirmation:   '[data-testid="confirmation"]',
  orderId:        '[data-testid="order-id"]',

  // Shared
  nextButton:     '[data-testid="btn-next"]',
}

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`)
}

async function runCheckoutTest() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  try {
    console.log('Puppeteer: Starting full checkout flow...\n')
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' })

    // --- Step 1: Contact Information ---
    console.log('Step 1: Filling contact information...')
    await page.waitForSelector(S.formContact)
    await page.type(S.firstName, 'Jane')
    await page.type(S.lastName, 'Smith')
    await page.type(S.email, 'jane@example.com')
    await page.type(S.phone, '555-123-4567')
    await page.click(S.nextButton)
    console.log('  ✓ Contact info submitted')

    // --- Step 2: Plan Selection ---
    console.log('Step 2: Selecting plan...')
    await page.waitForSelector(S.formPlan)
    await page.click(S.planPro)
    await page.click(S.nextButton)
    console.log('  ✓ Pro plan selected')

    // --- Step 3: Company Information ---
    console.log('Step 3: Filling company information...')
    await page.waitForSelector(S.formCompany)
    await page.type(S.companyName, 'Acme Corp')
    await page.select(S.companyType, 'LLC')
    await page.select(S.companyState, 'Delaware')
    await page.click(S.nextButton)
    console.log('  ✓ Company info submitted')

    // --- Step 4: Order Review ---
    console.log('Step 4: Reviewing order...')
    await page.waitForSelector(S.reviewName)

    const name = await page.$eval(S.reviewName, el => el.textContent.trim())
    assert(name === 'Jane Smith', `Expected "Jane Smith", got "${name}"`)

    const email = await page.$eval(S.reviewEmail, el => el.textContent.trim())
    assert(email === 'jane@example.com', `Expected "jane@example.com", got "${email}"`)

    const plan = await page.$eval(S.reviewPlan, el => el.textContent.trim())
    assert(plan === 'Pro', `Expected "Pro", got "${plan}"`)

    const company = await page.$eval(S.reviewCompany, el => el.textContent.trim())
    assert(company === 'Acme Corp', `Expected "Acme Corp", got "${company}"`)

    console.log('  ✓ Review data verified')
    await page.click(S.nextButton)

    // --- Step 5: Payment ---
    console.log('Step 5: Filling payment details...')
    await page.waitForSelector(S.formPayment)
    await page.type(S.cardName, 'Jane Smith')
    await page.type(S.cardNumber, '4111111111111111')
    await page.type(S.cardExpiry, '12/28')
    await page.type(S.cardCvv, '123')
    await page.type(S.cardZip, '90210')
    await page.click(S.nextButton)
    console.log('  ✓ Payment submitted')

    // --- Step 6: Confirmation ---
    console.log('Step 6: Verifying confirmation...')
    await page.waitForSelector(S.confirmation, { timeout: 15000 })

    const title = await page.$eval('h1', el => el.textContent.trim())
    assert(title === 'Order Confirmed!', `Expected "Order Confirmed!", got "${title}"`)

    const orderId = await page.$eval(S.orderId, el => el.textContent.trim())
    assert(orderId.includes('ORD-'), `Expected order ID with "ORD-", got "${orderId}"`)
    console.log(`  ✓ Order confirmed: ${orderId}`)

    console.log('\n✅ Puppeteer: All steps passed!')
  } catch (err) {
    console.error('\n❌ Puppeteer: Test failed!')
    console.error(err.message)
    process.exitCode = 1
  } finally {
    await browser.close()
  }
}

runCheckoutTest()
