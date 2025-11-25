// pageObjects/AlertsPage.js
class Alertpopup {
    constructor(page) {
        this.page = page;

        // Removed @aria-selected='false'
this.showFiltersLink = page.locator("xpath=//a[@data-testid='Show Filters']");
this.hidefiltersLink = page.locator("xpath=//a[@data-testid='Hide Filters']");
this.allAlertsTab = page.locator("xpath=//button[contains(text(),'All Alerts')]");
this.activeTab = page.locator("xpath=//button[contains(text(),'Active')]");
this.hiddenTab = page.locator("xpath=//button[contains(text(),'Hidden')]");
this.seenTab = page.locator("xpath=//button[contains(text(),'Seen')]");
this.expiredTab = page.locator("xpath=//button[contains(text(),'Expired')]");
this.pinnedTab = page.locator("xpath=//button[contains(text(),'Pinned')]");
this.profileTab = page.locator("xpath=//button[contains(text(),'Profile')]");

// filters (these are CSS locators)
this.daysSelectedInput = page.locator("xpath=//input[@id='alertsDaysSelected']");
this.startDateInput = page.locator("xpath=//input[@name='startDate']");
this.endDateInput = page.locator("xpath=//input[@name='endDate']");
this.priorityInput = page.locator("xpath=//input[@name='priority']");
this.categoryInput = page.locator("xpath=//input[@name='category']");
this.descriptionInput = page.locator("xpath=//input[@name='description']");
this.searchButton = page.locator("xpath=//button[@data-testid='Search']");
this.resetButton = page.locator("xpath=//button[@data-testid='Reset']");
this.sortByCriticalitySwitch = page.getByRole('checkbox', { name: 'filterAlerts' })
this.ButtonSaveAlert=page.locator("xpath=//button[@data-testid='saveAlerts']")


    }
     //Filters

     async clickOnShowFiltersLink()
     {
        await this.showFiltersLink.click()
     }

     async clickOnHideFiltersLink()
     {
        await this.hidefiltersLink.click()
     }

     async setDaysSelected() {
        await this.daysSelectedInput.click()
        await this.page.getByRole('option', { name: 'From last 60 Days' }).click()

    }

    async setStartDate(value) {
        await this.startDateInput.fill(value)
    }

    async setEndDate(value) {
        await this.endDateInput.fill(value)
    }

    async setPriority() {
        await this.priorityInput.click()
        await this.page.getByRole('option', { name: 'High', exact: true }).click()
    }

    async setCategory(value) {
        await this.categoryInput.click()
        await this.page.getByRole('option', { name: 'Medication' }).click()
    }

    async setDescription(value) {
        await this.descriptionInput.fill(value)
    }

    async clickSearch() {
        await this.searchButton.click()
    }

    async clickReset() {
        await this.resetButton.click()
    }

    async toggleSortByCriticality() {
        await this.sortByCriticalitySwitch.click()
    }

    async clickOnSaveButton()
    {
        await this.ButtonSaveAlert.click()
    }
    //top links
    async clickAllAlerts() {
        await this.allAlertsTab.click()
    }

    async clickActive() {
        await this.activeTab.click()
    }

    async clickHidden() {
        await this.hiddenTab.click()
    }

    async clickSeen() {
        await this.seenTab.click()
    }

    async clickExpired() {
        await this.expiredTab.click()
    }

    async clickPinned() {
        await this.pinnedTab.click()
    }

    async clickProfile() {
        await this.profileTab.click();
    }
}

module.exports = Alertpopup;
