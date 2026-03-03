export default class ContactPage {
  constructor(page) {
    this.page = page
    this.form      = '[data-testid="form-contact"]'
    this.firstName = '[data-testid="input-firstName"]'
    this.lastName  = '[data-testid="input-lastName"]'
    this.email     = '[data-testid="input-email"]'
    this.phone     = '[data-testid="input-phone"]'
    this.next      = '[data-testid="btn-next"]'
  }

  async waitForForm() {
    await this.page.waitForSelector(this.form)
  }

  async fill({ firstName, lastName, email, phone }) {
    await this.page.type(this.firstName, firstName)
    await this.page.type(this.lastName, lastName)
    await this.page.type(this.email, email)
    await this.page.type(this.phone, phone)
  }

  async submit() {
    await this.page.click(this.next)
  }
}
