/**
 * Selenium WebDriver — "The Foundation"
 *
 * The original browser automation tool. Everything is manual:
 * - Raw CSS selectors, XPath, attribute selectors — fragile, scattered
 * - Explicit waits everywhere (driver.wait, until.elementLocated)
 * - Verbose driver setup and teardown
 * - No built-in assertions — roll your own
 *
 * No data-testid here — that convention comes later.
 */

import { Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`)
}

async function runCheckoutTest() {
  const headless = process.argv.includes('--headless')

  const options = new chrome.Options()
  if (headless) options.addArguments('--headless=new')
  options.addArguments('--no-sandbox')
  options.addArguments('--disable-dev-shm-usage')

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build()

  try {
    console.log('Selenium: Starting full checkout flow...\n')
    await driver.get(BASE_URL)

    // --- Step 1: Contact Information ---
    console.log('Step 1: Filling contact information...')
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Contact Information"]')), 10000)

    const firstName = await driver.wait(until.elementLocated(By.css('input[autocomplete="given-name"]')), 5000)
    await firstName.clear()
    await firstName.sendKeys('Jane')

    const lastName = await driver.wait(until.elementLocated(By.css('input[autocomplete="family-name"]')), 5000)
    await lastName.clear()
    await lastName.sendKeys('Smith')

    const email = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 5000)
    await email.clear()
    await email.sendKeys('jane@example.com')

    const phone = await driver.wait(until.elementLocated(By.css('input[type="tel"]')), 5000)
    await phone.clear()
    await phone.sendKeys('555-123-4567')

    await (await driver.findElement(By.css('button.btn--primary'))).click()
    console.log('  ✓ Contact info submitted')

    // --- Step 2: Plan Selection ---
    console.log('Step 2: Selecting plan...')
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Choose Your Plan"]')), 10000)

    // Select the Pro plan — second .plan-card in the list
    const proCard = await driver.wait(until.elementLocated(By.xpath('//div[contains(@class,"plan-card")][.//div[text()="Pro"]]')), 5000)
    await proCard.click()

    await (await driver.findElement(By.css('button.btn--primary'))).click()
    console.log('  ✓ Pro plan selected')

    // --- Step 3: Company Information ---
    console.log('Step 3: Filling company information...')
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Company Information"]')), 10000)

    // First text input inside the company form
    const companyName = await driver.wait(until.elementLocated(By.css('form input[type="text"]')), 5000)
    await companyName.clear()
    await companyName.sendKeys('Acme Corp')

    // First select = company type, second select = state
    const selects = await driver.findElements(By.css('form select'))
    await selects[0].click()
    await (await driver.findElement(By.xpath('(//form//select)[1]/option[text()="LLC"]'))).click()

    await selects[1].click()
    await (await driver.findElement(By.xpath('(//form//select)[2]/option[text()="Delaware"]'))).click()

    await (await driver.findElement(By.css('button.btn--primary'))).click()
    console.log('  ✓ Company info submitted')

    // --- Step 4: Order Review ---
    console.log('Step 4: Reviewing order...')
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Review Your Order"]')), 10000)

    // Grab review values by navigating the DOM structure
    const reviewRows = await driver.findElements(By.css('.review-section .review-row span:last-child'))
    const reviewName = await reviewRows[0].getText()
    assert(reviewName === 'Jane Smith', `Expected "Jane Smith", got "${reviewName}"`)

    const reviewEmail = await reviewRows[1].getText()
    assert(reviewEmail === 'jane@example.com', `Expected "jane@example.com", got "${reviewEmail}"`)

    console.log('  ✓ Review data verified')
    await (await driver.findElement(By.xpath('//button[contains(text(),"Proceed to Payment")]'))).click()

    // --- Step 5: Payment ---
    console.log('Step 5: Filling payment details...')
    await driver.wait(until.elementLocated(By.xpath('//h1[text()="Payment"]')), 10000)

    const cardName = await driver.wait(until.elementLocated(By.css('input[autocomplete="cc-name"]')), 5000)
    await cardName.clear()
    await cardName.sendKeys('Jane Smith')

    const cardNumber = await driver.wait(until.elementLocated(By.css('input[autocomplete="cc-number"]')), 5000)
    await cardNumber.clear()
    await cardNumber.sendKeys('4111111111111111')

    const cardExpiry = await driver.wait(until.elementLocated(By.css('input[autocomplete="cc-exp"]')), 5000)
    await cardExpiry.clear()
    await cardExpiry.sendKeys('12/28')

    const cardCvv = await driver.wait(until.elementLocated(By.css('input[autocomplete="cc-csc"]')), 5000)
    await cardCvv.clear()
    await cardCvv.sendKeys('123')

    const cardZip = await driver.wait(until.elementLocated(By.css('input[autocomplete="postal-code"]')), 5000)
    await cardZip.clear()
    await cardZip.sendKeys('90210')

    await (await driver.findElement(By.xpath('//button[text()="Pay Now"]'))).click()
    console.log('  ✓ Payment submitted')

    // --- Step 6: Confirmation ---
    console.log('Step 6: Verifying confirmation...')
    await driver.wait(until.elementLocated(By.css('.confirmation')), 15000)

    const title = await (await driver.findElement(By.css('.confirmation__title'))).getText()
    assert(title === 'Order Confirmed!', `Expected "Order Confirmed!", got "${title}"`)

    const orderId = await (await driver.findElement(By.css('.confirmation__order-id'))).getText()
    assert(orderId.includes('ORD-'), `Expected order ID with "ORD-", got "${orderId}"`)
    console.log(`  ✓ Order confirmed: ${orderId}`)

    console.log('\n✅ Selenium: All steps passed!')
  } catch (err) {
    console.error('\n❌ Selenium: Test failed!')
    console.error(err.message)
    process.exitCode = 1
  } finally {
    await driver.quit()
  }
}

runCheckoutTest()
