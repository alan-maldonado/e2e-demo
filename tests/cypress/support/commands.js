/**
 * Cypress Custom Commands — "Developer Experience Revolution"
 *
 * In the Cypress community, Page Object Model is debated.
 * Custom commands are the preferred pattern:
 * - Chainable, reusable, composable
 * - Built into the Cypress API (no class boilerplate)
 * - Uses data-testid selectors — the community standard
 * - Auto-retry built in — no manual waits!
 */

// --- Step 1: Contact Information ---
Cypress.Commands.add('fillContactInfo', ({ firstName, lastName, email, phone }) => {
  cy.get('[data-testid="form-contact"]').should('be.visible')
  cy.get('[data-testid="input-firstName"]').type(firstName)
  cy.get('[data-testid="input-lastName"]').type(lastName)
  cy.get('[data-testid="input-email"]').type(email)
  cy.get('[data-testid="input-phone"]').type(phone)
  cy.get('[data-testid="btn-next"]').click()
})

// --- Step 2: Plan Selection ---
Cypress.Commands.add('selectPlan', (planId) => {
  cy.get('[data-testid="form-plan"]').should('be.visible')
  cy.get(`[data-testid="plan-${planId}"]`).click()
  cy.get(`[data-testid="plan-${planId}"]`).should('have.class', 'plan-card--selected')
  cy.get('[data-testid="btn-next"]').click()
})

// --- Step 3: Company Information ---
Cypress.Commands.add('fillCompanyInfo', ({ companyName, companyType, state }) => {
  cy.get('[data-testid="form-company"]').should('be.visible')
  cy.get('[data-testid="input-companyName"]').type(companyName)
  cy.get('[data-testid="input-companyType"]').select(companyType)
  cy.get('[data-testid="input-companyState"]').select(state)
  cy.get('[data-testid="btn-next"]').click()
})

// --- Step 4: Verify Review Data ---
Cypress.Commands.add('verifyReview', ({ name, email, planName, companyName }) => {
  cy.get('[data-testid="review-name"]').should('have.text', name)
  cy.get('[data-testid="review-email"]').should('have.text', email)
  cy.get('[data-testid="review-plan-name"]').should('have.text', planName)
  cy.get('[data-testid="review-companyName"]').should('have.text', companyName)
  cy.get('[data-testid="btn-next"]').click()
})

// --- Step 5: Payment ---
Cypress.Commands.add('fillPayment', ({ cardName, cardNumber, expiry, cvv, zip }) => {
  cy.get('[data-testid="form-payment"]').should('be.visible')
  cy.get('[data-testid="input-cardName"]').type(cardName)
  cy.get('[data-testid="input-cardNumber"]').type(cardNumber)
  cy.get('[data-testid="input-cardExpiry"]').type(expiry)
  cy.get('[data-testid="input-cardCvv"]').type(cvv)
  cy.get('[data-testid="input-cardZip"]').type(zip)
  cy.get('[data-testid="btn-next"]').click()
})

// --- Step 6: Verify Confirmation ---
Cypress.Commands.add('verifyConfirmation', () => {
  cy.get('[data-testid="confirmation"]', { timeout: 15000 }).should('be.visible')
  cy.contains('h1', 'Order Confirmed!')
  cy.get('[data-testid="order-id"]').should('contain', 'ORD-')
})
