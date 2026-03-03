export default class ConfirmationPage {
  constructor(page) {
    this.page = page
    this.confirmation = '[data-testid="confirmation"]'
    this.orderId      = '[data-testid="order-id"]'
  }

  async waitForConfirmation() {
    await this.page.waitForSelector(this.confirmation, { timeout: 15000 })
  }

  async getTitle() {
    return this.page.$eval('h1', el => el.textContent.trim())
  }

  async getOrderId() {
    return this.page.$eval(this.orderId, el => el.textContent.trim())
  }
}
