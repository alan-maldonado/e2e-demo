export default class PlanPage {
  constructor(page) {
    this.page = page
    this.form    = '[data-testid="form-plan"]'
    this.planPro = '[data-testid="plan-pro"]'
    this.next    = '[data-testid="btn-next"]'
  }

  async waitForForm() {
    await this.page.waitForSelector(this.form)
  }

  async selectPro() {
    await this.page.click(this.planPro)
  }

  async submit() {
    await this.page.click(this.next)
  }
}
