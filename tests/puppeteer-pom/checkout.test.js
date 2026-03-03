/**
 * Puppeteer + Page Object Model
 *
 * Same test as the flat Puppeteer version, but organized with POM classes.
 * Each page class encapsulates:
 *   - Selectors (data-testid)
 *   - Actions (fill, submit)
 *   - Queries (getName, getEmail, …)
 *
 * The test reads like a script — no selectors leak into the test file.
 * If the UI changes, you update the page class, not every test.
 */

import puppeteer from 'puppeteer'
import ContactPage from './pages/ContactPage.js'
import PlanPage from './pages/PlanPage.js'
import CompanyPage from './pages/CompanyPage.js'
import ReviewPage from './pages/ReviewPage.js'
import PaymentPage from './pages/PaymentPage.js'
import ConfirmationPage from './pages/ConfirmationPage.js'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`)
}

async function runCheckoutTest() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Instantiate page objects
  const contact      = new ContactPage(page)
  const plan         = new PlanPage(page)
  const company      = new CompanyPage(page)
  const review       = new ReviewPage(page)
  const payment      = new PaymentPage(page)
  const confirmation = new ConfirmationPage(page)

  try {
    console.log('Puppeteer (POM): Starting full checkout flow...\n')
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' })

    // --- Step 1: Contact Information ---
    console.log('Step 1: Filling contact information...')
    await contact.waitForForm()
    await contact.fill({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '555-123-4567',
    })
    await contact.submit()
    console.log('  ✓ Contact info submitted')

    // --- Step 2: Plan Selection ---
    console.log('Step 2: Selecting plan...')
    await plan.waitForForm()
    await plan.selectPro()
    await plan.submit()
    console.log('  ✓ Pro plan selected')

    // --- Step 3: Company Information ---
    console.log('Step 3: Filling company information...')
    await company.waitForForm()
    await company.fill({
      name: 'Acme Corp',
      type: 'LLC',
      state: 'Delaware',
    })
    await company.submit()
    console.log('  ✓ Company info submitted')

    // --- Step 4: Order Review ---
    console.log('Step 4: Reviewing order...')
    await review.waitForReview()

    const name = await review.getName()
    assert(name === 'Jane Smith', `Expected "Jane Smith", got "${name}"`)

    const email = await review.getEmail()
    assert(email === 'jane@example.com', `Expected "jane@example.com", got "${email}"`)

    const planName = await review.getPlan()
    assert(planName === 'Pro', `Expected "Pro", got "${planName}"`)

    const companyName = await review.getCompany()
    assert(companyName === 'Acme Corp', `Expected "Acme Corp", got "${companyName}"`)

    console.log('  ✓ Review data verified')
    await review.submit()

    // --- Step 5: Payment ---
    console.log('Step 5: Filling payment details...')
    await payment.waitForForm()
    await payment.fill({
      name: 'Jane Smith',
      number: '4111111111111111',
      expiry: '12/28',
      cvv: '123',
      zip: '90210',
    })
    await payment.submit()
    console.log('  ✓ Payment submitted')

    // --- Step 6: Confirmation ---
    console.log('Step 6: Verifying confirmation...')
    await confirmation.waitForConfirmation()

    const title = await confirmation.getTitle()
    assert(title === 'Order Confirmed!', `Expected "Order Confirmed!", got "${title}"`)

    const orderId = await confirmation.getOrderId()
    assert(orderId.includes('ORD-'), `Expected order ID with "ORD-", got "${orderId}"`)
    console.log(`  ✓ Order confirmed: ${orderId}`)

    console.log('\n✅ Puppeteer (POM): All steps passed!')
  } catch (err) {
    console.error('\n❌ Puppeteer (POM): Test failed!')
    console.error(err.message)
    process.exitCode = 1
  } finally {
    await browser.close()
  }
}

runCheckoutTest()
