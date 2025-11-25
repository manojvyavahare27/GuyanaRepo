class PatientSummary {
    constructor(page) {
        this.page = page;
        this.alertButton=page.locator("xpath=//img[@alt='Alert']")

    }
    async clickOnAlertIcon()
    {
        await this.alertButton.click()
    }
}
module.exports=PatientSummary
