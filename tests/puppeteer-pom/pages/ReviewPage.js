export default class ReviewPage {
  constructor(page) {
    this.page = page
    this.name    = '[data-testid="review-name"]'
    this.email   = '[data-testid="review-email"]'
    this.plan    = '[data-testid="review-plan-name"]'
    this.company = '[data-testid="review-companyName"]'
    this.next    = '[data-testid="btn-next"]'
  }

  async waitForReview() {
    await this.page.waitForSelector(this.name)
  }

  async getName() {
    return this.page.$eval(this.name, el => el.textContent.trim())
  }

  async getEmail() {
    return this.page.$eval(this.email, el => el.textContent.trim())
  }

  async getPlan() {
    return this.page.$eval(this.plan, el => el.textContent.trim())
  }

  async getCompany() {
    return this.page.$eval(this.company, el => el.textContent.trim())
  }

  async submit() {
    await this.page.click(this.next)
  }
}
