export default class CompanyPage {
  constructor(page) {
    this.page = page
    this.form        = '[data-testid="form-company"]'
    this.companyName = '[data-testid="input-companyName"]'
    this.companyType = '[data-testid="input-companyType"]'
    this.state       = '[data-testid="input-companyState"]'
    this.next        = '[data-testid="btn-next"]'
  }

  async waitForForm() {
    await this.page.waitForSelector(this.form)
  }

  async fill({ name, type, state }) {
    await this.page.type(this.companyName, name)
    await this.page.select(this.companyType, type)
    await this.page.select(this.state, state)
  }

  async submit() {
    await this.page.click(this.next)
  }
}
