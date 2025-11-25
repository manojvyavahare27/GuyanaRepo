class BackToStock {
    constructor(page) {
        this.page = page;

        // Sidebar
        this.batchQty = page.locator("xpath=//input[@data-testid='batchReturnQuantity']");
        this.reasonforReturn=page.locator("xpath=//textarea[@id='reasonForReturn']")
        this.SaveButton=page.locator("xpath=//button[@data-testid='saveBacKToStock']")
        
    }

    async enterBatchQty() {
        await this.batchQty.fill('5');
    }

    async enterReasonforReturn()
    {
        await this.reasonforReturn.fill('Added for testing')
    }
    async clickOnSavebutton()
    {
        await this.SaveButton.click()
    }
   
}

module.exports = BackToStock;
