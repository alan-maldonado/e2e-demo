/**
 * Cypress — "Developer Experience Revolution"
 *
 * Demonstrates:
 * - Custom Commands instead of POM (cy.fillContactInfo, cy.selectPlan, etc.)
 * - data-testid selectors — the Cypress community standard
 * - Auto-retry on assertions — no manual waits
 * - Chainable, readable, declarative syntax
 * - Runs in the browser — time-travel debugging
 */

describe('Full Checkout Flow', () => {
  it('should complete the entire checkout process', () => {
    cy.visit('/')

    // Step 1: Contact Information
    cy.fillContactInfo({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '555-123-4567',
    })

    // Step 2: Select Pro Plan
    cy.selectPlan('pro')

    // Step 3: Company Information
    cy.fillCompanyInfo({
      companyName: 'Acme Corp',
      companyType: 'LLC',
      state: 'Delaware',
    })

    // Step 4: Review Order
    cy.verifyReview({
      name: 'Jane Smith',
      email: 'jane@example.com',
      planName: 'Pro',
      companyName: 'Acme Corp',
    })

    // Step 5: Payment
    cy.fillPayment({
      cardName: 'Jane Smith',
      cardNumber: '4111111111111111',
      expiry: '12/28',
      cvv: '123',
      zip: '90210',
    })

    // Step 6: Confirmation
    cy.verifyConfirmation()
  })
})
