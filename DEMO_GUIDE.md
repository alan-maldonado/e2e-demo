# Demo Guide: The Evolution of E2E Testing

## Before you start

```bash
npm install
npm run dev                       # Leave running in a terminal (port 5173)
npx playwright install chromium   # First time only
```

Verify the app works by opening http://localhost:5173 in your browser.

> **Stagehand** requires an `ANTHROPIC_API_KEY` environment variable. If you don't have one, you can skip that section or just walk through the code.

---

## Demo structure (~30 min)

| # | Tool        | Time     | Command |
|---|-------------|----------|---------|
| 1 | Selenium    | ~4 min   | `npm run test:selenium` |
| 2 | Puppeteer   | ~4 min   | `npm run test:puppeteer` |
| 3 | Cypress     | ~6 min   | `npm run test:cypress` |
| 4 | Playwright  | ~6 min   | `npm run test:playwright` |
| 5 | Stagehand   | ~10 min  | `npm run test:stagehand` |

---

## Narrative threads

Three threads run through the entire demo. Each section advances them:

### Thread 1: Selectors

| Tool        | Strategy | Example |
|-------------|----------|---------|
| Selenium    | Raw CSS, XPath, HTML attributes | `By.css('input[autocomplete="given-name"]')` |
| Puppeteer   | `data-testid` + selector dictionary | `page.type(S.firstName, 'Jane')` |
| Cypress     | `data-testid` standardized as best practice | `cy.get('[data-testid="input-firstName"]')` |
| Playwright  | Semantic locators that reflect what the user sees | `page.getByLabel('First Name')` |
| Stagehand   | Natural language — zero selectors | `act('Type "Jane" in the First Name field')` |

### Thread 2: Waits

| Tool        | How it handles async |
|-------------|---------------------|
| Selenium    | `driver.wait(until.elementLocated(...), 5000)` on every interaction |
| Puppeteer   | `page.waitForSelector(...)` before every action |
| Cypress     | Built-in auto-retry — you write no waits |
| Playwright  | Auto-wait on every action and assertion |
| Stagehand   | The AI waits and retries on its own |

### Thread 3: Assertions

| Tool        | How you verify |
|-------------|----------------|
| Selenium    | Hand-rolled `assert()` — you build it yourself |
| Puppeteer   | Hand-rolled `assert()` — same story |
| Cypress     | `.should('have.text', ...)` — declarative, with retry |
| Playwright  | `expect(...).toHaveText(...)` — built-in, with retry |
| Stagehand   | `extract()` + manual check, or trust that `act()` throws if the element doesn't exist |

---

## Section 1: Selenium (~4 min)

**File:** `tests/selenium/checkout.test.js`

**Key message:** "This is how testing worked in 2012. It works, but it hurts."

### What to show in the code

1. **Verbose setup** — The `Builder` pattern to create the driver:
   ```js
   const driver = await new Builder()
     .forBrowser('chrome')
     .setChromeOptions(options)
     .build()
   ```
   Point out that you have to manage the ChromeDriver binary and it must match your Chrome version.

2. **Fragile selectors** — A mix of strategies with no convention:
   ```js
   By.css('input[autocomplete="given-name"]')    // HTML attribute
   By.css('input[type="email"]')                  // input type
   By.xpath('//div[contains(@class,"plan-card")][.//div[text()="Pro"]]')  // complex XPath
   By.css('.review-section .review-row span:last-child')  // positional, fragile
   ```
   Ask the audience: "What happens when the designer reorders the fields?"

3. **Waits everywhere** — Every interaction needs an explicit wait:
   ```js
   const firstName = await driver.wait(until.elementLocated(By.css('input[autocomplete="given-name"]')), 5000)
   await firstName.clear()
   await firstName.sendKeys('Jane')
   ```
   3 lines to type into a single field. Compare with what comes next.

4. **Manual teardown** — `driver.quit()` in the `finally` block. Forget it and you get a zombie Chrome process.

### Run it

```bash
npm run test:selenium
```

### Pain points to highlight

- Selecting the Pro plan requires a 2-line XPath expression
- Dropdowns use `(//form//select)[1]` and `(//form//select)[2]` — positional selectors that break if you add another select
- Assertions are a homemade `assert()` — no retry, no pretty diff
- ~100 lines for a single flow

---

## Section 2: Puppeteer (~4 min)

**File:** `tests/puppeteer/checkout.test.js`

**Key message:** "Same flow, less pain. Chrome DevTools Protocol direct, no WebDriver middleman."

### What to show in the code

1. **Simpler launch:**
   ```js
   const browser = await puppeteer.launch({ headless: true })
   const page = await browser.newPage()
   ```
   vs Selenium's Builder. Two lines vs six.

2. **Introducing `data-testid`** — This is the key selector moment:
   ```js
   await page.type('[data-testid="input-firstName"]', 'Jane')
   await page.click('[data-testid="btn-next"]')
   ```
   Explain: "The frontend team added `data-testid` attributes specifically for testing. Now selectors are stable — they don't depend on visual design or CSS classes."

3. **The selector dictionary** — Scroll up to the `S` object:
   ```js
   const S = {
     firstName:    '[data-testid="input-firstName"]',
     lastName:     '[data-testid="input-lastName"]',
     email:        '[data-testid="input-email"]',
     nextButton:   '[data-testid="btn-next"]',
     // ...
   }
   ```
   Explain: "This was the classic convention — centralize all your selectors in a dictionary or hash map. If the UI changes, you update one place instead of hunting through the entire test. This was the industry's first answer to selector chaos. With `data-testid` the selectors are already stable, but the pattern stuck around."

   Then show how the test reads cleaner because of it:
   ```js
   await page.type(S.firstName, 'Jane')
   await page.click(S.nextButton)
   ```
   vs repeated raw strings everywhere.

4. **Cleaner API** — Compare with Selenium:
   ```js
   // Selenium: 3 lines
   const el = await driver.wait(until.elementLocated(By.css('...')), 5000)
   await el.clear()
   await el.sendKeys('Jane')

   // Puppeteer: 1 line
   await page.type(S.firstName, 'Jane')
   ```

5. **But still manual waits:**
   ```js
   await page.waitForSelector(S.formContact)
   ```
   It's still your responsibility to know when to wait.

### Run it

```bash
npm run test:puppeteer
```

### Transition to Cypress

"Puppeteer improved the ergonomics, but it's still an automation library, not a testing framework. No assertions, no retry, no debugger. That's where Cypress comes in."

---

## Section 3: Cypress (~6 min)

**Main file:** `tests/cypress/e2e/checkout.cy.js`
**Custom commands:** `tests/cypress/support/commands.js`

**Key message:** "Cypress changed the conversation. Testing was no longer just a QA thing — now developers actually wanted to write tests."

### What to show in the code

1. **Custom Commands instead of POM** — Open `commands.js`:
   ```js
   Cypress.Commands.add('fillContactInfo', ({ firstName, lastName, email, phone }) => {
     cy.get('[data-testid="form-contact"]').should('be.visible')
     cy.get('[data-testid="input-firstName"]').type(firstName)
     // ...
   })
   ```
   Explain: "The Cypress community debated Page Object Model extensively. The conclusion was that custom commands are more idiomatic — they're chainable, reusable, and don't need class boilerplate."

   Point out: "And notice we don't need a selector dictionary anymore. The selectors live inside the commands — encapsulated, not scattered."

2. **The test reads like a script** — Open `checkout.cy.js`:
   ```js
   cy.fillContactInfo({ firstName: 'Jane', lastName: 'Smith', ... })
   cy.selectPlan('pro')
   cy.fillCompanyInfo({ companyName: 'Acme Corp', ... })
   cy.verifyReview({ name: 'Jane Smith', ... })
   cy.fillPayment({ cardName: 'Jane Smith', ... })
   cy.verifyConfirmation()
   ```
   Compare with Selenium's ~100 lines.

3. **Auto-retry on assertions:**
   ```js
   cy.get('[data-testid="review-name"]').should('have.text', 'Jane Smith')
   ```
   No `waitForSelector`. Cypress automatically retries until it passes or the timeout expires.

4. **`should('be.visible')` instead of `waitForSelector`:**
   ```js
   cy.get('[data-testid="form-contact"]').should('be.visible')
   ```

### Run it

```bash
npm run test:cypress
```

Cypress prints a nice results table. Mention that in interactive mode (`npx cypress open`) you get time-travel debugging.

### Limitations to mention

- Single-tab: can't test flows that open another tab
- At this point in history it was Chrome/Electron only (more browsers came later)

---

## Section 4: Playwright (~6 min)

**File:** `tests/playwright/checkout.spec.js`

**Key message:** "Playwright took the best of everything and added semantic locators. The test describes what the user sees, not the DOM."

### What to show in the code

1. **Semantic locators** — The big differentiator:
   ```js
   await page.getByLabel('First Name').fill('Jane')
   await page.getByRole('button', { name: 'Next' }).click()
   ```
   Compare side by side:
   ```
   Selenium:    By.css('input[autocomplete="given-name"]')
   Puppeteer:   S.firstName  →  '[data-testid="input-firstName"]'
   Cypress:     cy.get('[data-testid="input-firstName"]')
   Playwright:  page.getByLabel('First Name')
   ```
   Ask: "Which of these would a non-developer understand?"

2. **Auto-wait on EVERYTHING** — There's not a single `waitForSelector` in the file:
   ```js
   await page.getByLabel('First Name').fill('Jane')  // auto-waits
   ```

3. **Assertions with auto-retry:**
   ```js
   await expect(page.getByTestId('review-name')).toHaveText('Jane Smith')
   ```
   Similar to Cypress but with native `async/await`.

4. **Mix of locators** — Uses the most expressive one for each case:
   - `getByLabel()` for form inputs
   - `getByRole('button', { name })` for buttons
   - `getByTestId()` for elements without a semantic label (plan cards, review data)
   - `getByRole('heading', { name })` to verify titles

5. **Flat file** — No POM, no custom commands, no selector dictionary. The locators are so expressive the test is self-documenting.

### Run it

```bash
npm run test:playwright
```

### Extras to mention (if there's time)

- `npx playwright codegen` — generates tests by recording your interactions
- `npx playwright test --trace on` — records a trace for post-mortem debugging
- Multi-browser out of the box (Chromium, Firefox, WebKit)

---

## Section 5: Stagehand (~10 min)

**File:** `tests/stagehand/checkout.test.js`

**Key message:** "What if you could tell the browser what to do in plain English and it just understood?"

> Requires `ANTHROPIC_API_KEY` to run. If you don't have one, walk through the code and the concept.

### What to show in the code

1. **Zero selectors:**
   ```js
   await stagehand.act('Type "Jane" in the First Name field')
   await stagehand.act('Click the Next button')
   await stagehand.act('Click on the Pro plan card')
   ```
   No CSS, no XPath, no data-testid. Just natural language.

2. **`extract()` to verify:**
   ```js
   const reviewData = await stagehand.extract(
     'Extract the review data: the name, email, plan name, and company name'
   )
   ```
   The AI reads the page and returns structured data.

3. **Resilience to UI changes** — If the designer changes the layout, renames CSS classes, or reorganizes the form, this test keeps working. The other four break.

4. **Compare all 5 tools for the same action:**
   ```
   // Selenium
   const el = await driver.wait(until.elementLocated(By.css('input[autocomplete="given-name"]')), 5000)
   await el.clear()
   await el.sendKeys('Jane')

   // Puppeteer
   await page.type(S.firstName, 'Jane')

   // Cypress
   cy.get('[data-testid="input-firstName"]').type('Jane')

   // Playwright
   await page.getByLabel('First Name').fill('Jane')

   // Stagehand
   await stagehand.act('Type "Jane" in the First Name field')
   ```

### Run it

```bash
ANTHROPIC_API_KEY=sk-... npm run test:stagehand
```

### Trade-offs to discuss

- **Speed**: each `act()` makes an LLM call (~1-3s per action vs milliseconds)
- **Cost**: every run consumes API tokens
- **Determinism**: can fail non-deterministically if the LLM misinterprets
- **Best for**: smoke tests, critical flows that change often, exploratory testing
- **Doesn't replace**: large test suites running thousands of times a day in CI

---

## What's coming: WebMCP and the end of selectors

After running the Stagehand demo, pause and ask: "Stagehand solved the selector problem with AI. But there's a cost — every action is an LLM call. What if the page could just *tell* the agent what it can do?"

### The idea

Every tool we've seen today works the same way: the **test** figures out the page. Whether it's XPath, data-testid, semantic locators, or an LLM reading the screen — the test is always the one doing the work.

[WebMCP](https://webmcp.link/) flips that model. It's a W3C standard (backed by Google and Microsoft) where **the page declares its capabilities** as structured tools that AI agents can call directly.

```
Today:     Test → interprets the UI → finds elements → performs actions
WebMCP:    Test → asks the page "what can you do?" → calls structured tools
```

### How it works

Instead of scraping the DOM, a page registers tools via `navigator.modelContext`:

```js
// The page declares what it can do
navigator.modelContext.registerTool({
  name: 'fillContactForm',
  description: 'Fill out the contact information step',
  schema: {
    firstName: { type: 'string' },
    lastName:  { type: 'string' },
    email:     { type: 'string' },
    phone:     { type: 'string' },
  },
  handler: async ({ firstName, lastName, email, phone }) => {
    // The page handles the implementation
  }
})
```

An AI agent (or test) can then discover and call those tools — no selectors, no LLM inference, no guessing.

### Why it matters for testing

| Problem | How WebMCP solves it |
|---------|---------------------|
| Selectors break when UI changes | Tool contracts stay stable across redesigns |
| LLM calls are slow and expensive | Structured calls — no AI inference needed |
| Tests are tightly coupled to DOM | Tests call semantic capabilities, not elements |
| data-testid is a testing-only concern | Tools are first-class features of the page |

### Where it stands (as of early 2026)

- **Aug 2025**: Google and Microsoft publish unified spec
- **Sep 2025**: W3C Community Group accepts WebMCP as a deliverable
- **Feb 2026**: Chrome 146 Canary ships early preview behind a feature flag

### The full arc

```
Selenium    → "I'll find it in the DOM myself"     (CSS, XPath)
Puppeteer   → "Give me stable hooks"               (data-testid)
Cypress     → "Make it chainable and retry"         (custom commands)
Playwright  → "Describe what the user sees"         (getByLabel, getByRole)
Stagehand   → "Just tell me in English"             (natural language + AI)
WebMCP      → "The page tells ME what it can do"    (structured tool contracts)
```

> "We went from the test speaking the DOM's language, to AI interpreting the UI, to the page itself declaring its capabilities. The selector is dead — long live the tool contract."

---

## Closing summary

### Comparison table

| | Selenium | Puppeteer | Cypress | Playwright | Stagehand |
|---|---|---|---|---|---|
| **Selectors** | Raw CSS/XPath | `data-testid` + dictionary | `data-testid` + commands | Semantic (`getByLabel`) | Natural language |
| **Waits** | Manual | Manual | Auto-retry | Auto-wait | AI decides |
| **Assertions** | Hand-rolled | Hand-rolled | Built-in + retry | Built-in + retry | `extract()` |
| **Lines of code** | ~100 | ~60 | ~20 (+ commands) | ~30 | ~40 |
| **Learning curve** | High | Medium | Low | Low | Very low |
| **Debugging** | Difficult | DevTools | Time-travel | Trace viewer | AI logs |
| **Multi-browser** | Yes (with drivers) | Chrome only* | Limited* | Yes, native | Via Playwright |
| **Speed** | Slow | Fast | Fast | Fast | Slow (LLM) |

*Current versions of Puppeteer support Firefox and Cypress supports more browsers, but historically they were limited.

### The closing point

> "There's no perfect tool. There's a natural progression:
> selectors go from 'speaking the DOM's language' to 'speaking the user's language'
> to the page declaring its own capabilities.
> Each generation removed friction, and WebMCP might remove the selector entirely."

---

## Presentation tips

1. **Open files side by side** — Keep two files in split view for comparison (e.g. Selenium vs Playwright)
2. **Run each test live** — The console output is part of the show
3. **Ask the question** — After each tool, ask: "What got better? What still hurts?"
4. **Don't apologize for Selenium** — It was revolutionary for its time. The point isn't that it was bad, it's how far we've come.
5. **Save Stagehand for last** — It's the wow moment. Close with it.
