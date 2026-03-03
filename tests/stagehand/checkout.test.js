/**
 * Stagehand — "The AI Future"
 *
 * Demonstrates:
 * - No selectors at all — just natural language
 * - No Page Object Model, no custom commands, no patterns
 * - act() describes user intent in plain English
 * - Works even if the UI changes (no brittle selectors to break)
 * - The test reads like a user story
 *
 * Requires: OPENAI_API_KEY environment variable
 */

import { Stagehand } from '@browserbasehq/stagehand'
import { z } from 'zod'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`)
}

async function runCheckoutTest() {
  const stagehand = new Stagehand({
    env: 'LOCAL',
    model: 'openai/gpt-4o-mini',
    localBrowserLaunchOptions: {
      headless: false,
    },
  })

  await stagehand.init()
  const page = stagehand.context.pages()[0]

  try {
    console.log('Stagehand: Starting full checkout flow...\n')

    await page.goto(BASE_URL)

    // --- Step 1: Contact Information ---
    // Just describe what a human would do. No selectors needed.
    console.log('Step 1: Filling contact information...')
    await stagehand.act('Type "Jane" in the First Name field')
    await stagehand.act('Type "Smith" in the Last Name field')
    await stagehand.act('Type "jane@example.com" in the Email field')
    await stagehand.act('Type "555-123-4567" in the Phone field')
    await stagehand.act('Click the Next button')
    console.log('  ✓ Contact info submitted')

    // --- Step 2: Select Pro Plan ---
    console.log('Step 2: Selecting plan...')
    await stagehand.act('Click on the Pro plan card')
    await stagehand.act('Click the Next button')
    console.log('  ✓ Pro plan selected')

    // --- Step 3: Company Information ---
    console.log('Step 3: Filling company information...')
    await stagehand.act('Type "Acme Corp" in the Company Name field')
    await stagehand.act('Select "LLC" from the Company Type dropdown')
    await stagehand.act('Select "Delaware" from the State of Formation dropdown')
    await stagehand.act('Click the Next button')
    console.log('  ✓ Company info submitted')

    // --- Step 4: Order Review ---
    // extract() with a Zod schema — the AI reads the page and returns typed data
    console.log('Step 4: Reviewing order...')

    const reviewData = await stagehand.extract(
      'Extract the order review information displayed on the page',
      z.object({
        name: z.string().describe('Full name of the contact'),
        email: z.string().describe('Email address'),
        phone: z.string().describe('Phone number'),
        planName: z.string().describe('Selected plan name'),
        planPrice: z.string().describe('Plan price'),
        companyName: z.string().describe('Company name'),
        companyType: z.string().describe('Company type (LLC, Corporation, etc.)'),
        state: z.string().describe('State of formation'),
      })
    )

    console.log('  Extracted review data:')
    console.log(`    Name:    ${reviewData.name}`)
    console.log(`    Email:   ${reviewData.email}`)
    console.log(`    Phone:   ${reviewData.phone}`)
    console.log(`    Plan:    ${reviewData.planName} (${reviewData.planPrice})`)
    console.log(`    Company: ${reviewData.companyName} (${reviewData.companyType})`)
    console.log(`    State:   ${reviewData.state}`)

    // Assert on the extracted data — just like the other tools, but the AI did the reading
    assert(reviewData.name.includes('Jane Smith'), `Expected name "Jane Smith", got "${reviewData.name}"`)
    assert(reviewData.email === 'jane@example.com', `Expected email "jane@example.com", got "${reviewData.email}"`)
    assert(reviewData.planName === 'Pro', `Expected plan "Pro", got "${reviewData.planName}"`)
    assert(reviewData.companyName === 'Acme Corp', `Expected company "Acme Corp", got "${reviewData.companyName}"`)

    console.log('  ✓ Review data verified via extract()')

    await stagehand.act('Click the Proceed to Payment button')

    // --- Step 5: Payment ---
    console.log('Step 5: Filling payment details...')
    await stagehand.act('Type "Jane Smith" in the Name on Card field')
    await stagehand.act('Type "4111111111111111" in the Card Number field')
    await stagehand.act('Type "12/28" in the Expiry field')
    await stagehand.act('Type "123" in the CVV field')
    await stagehand.act('Type "90210" in the Billing ZIP field')
    await stagehand.act('Click the Pay Now button')
    console.log('  ✓ Payment submitted')

    // --- Step 6: Confirmation ---
    console.log('Step 6: Verifying confirmation...')
    await page.waitForSelector('[data-testid="confirmation"]', { timeout: 15000 })

    const confirmation = await stagehand.extract(
      'Extract the order confirmation details from the page',
      z.object({
        title: z.string().describe('The confirmation heading'),
        orderId: z.string().describe('The order ID (starts with ORD-)'),
      })
    )

    console.log(`  Title:    ${confirmation.title}`)
    console.log(`  Order ID: ${confirmation.orderId}`)

    assert(confirmation.title === 'Order Confirmed!', `Expected "Order Confirmed!", got "${confirmation.title}"`)
    assert(confirmation.orderId.includes('ORD-'), `Expected order ID with "ORD-", got "${confirmation.orderId}"`)
    console.log('  ✓ Order confirmed via extract()')

    console.log('\n✅ Stagehand: All steps passed!')
  } catch (err) {
    console.error('\n❌ Stagehand: Test failed!')
    console.error(err.message)
    process.exitCode = 1
  } finally {
    await stagehand.close()
  }
}

runCheckoutTest()
