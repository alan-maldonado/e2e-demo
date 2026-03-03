export default class PaymentPage {
  constructor(page) {
    this.page = page
    this.form       = '[data-testid="form-payment"]'
    this.cardName   = '[data-testid="input-cardName"]'
    this.cardNumber = '[data-testid="input-cardNumber"]'
    this.cardExpiry = '[data-testid="input-cardExpiry"]'
    this.cardCvv    = '[data-testid="input-cardCvv"]'
    this.cardZip    = '[data-testid="input-cardZip"]'
    this.next       = '[data-testid="btn-next"]'
  }

  async waitForForm() {
    await this.page.waitForSelector(this.form)
  }

  async fill({ name, number, expiry, cvv, zip }) {
    await this.page.type(this.cardName, name)
    await this.page.type(this.cardNumber, number)
    await this.page.type(this.cardExpiry, expiry)
    await this.page.type(this.cardCvv, cvv)
    await this.page.type(this.cardZip, zip)
  }

  async submit() {
    await this.page.click(this.next)
  }
}
