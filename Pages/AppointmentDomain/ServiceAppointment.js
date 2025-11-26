const { page,expect } = require("@playwright/test")

class ServiceAppointment
{
    //const AllLink;
    constructor(page)
    {
        this.page=page
        this.btnBack=page.getByLabel('Back Button')

        //AllLinks        
        this.allLinks=page.getByTestId('Links')
        this.linkAppReminder=page.getByRole('heading', { name: 'Appointment Reminders' })
        this.linkBookAppointment=page.getByRole('heading', { name: 'Book Appointment' })
        this.linkDeitetics=page.getByRole('heading', { name: 'Dietetics' })
        this.linkFinance=page.getByRole('heading', { name: 'Finance' })
        this.linkInfusion=page.getByRole('heading', { name: 'Infusions' })
        this.linkPatientAdd=page.getByRole('heading', { name: 'Patient Add' })
        this.linkRefresh=page.getByRole('heading', { name: 'Refresh' })
        this.linkRoomManagement=page.getByRole('heading', { name: 'Room Management' })
        this.linkRooms=page.getByRole('heading', { name: 'Rooms' })
        this.linkService=page.getByTestId('service').getByRole('heading', { name: 'Service' })
        this.linkServiceAppointment=page.getByTestId('serviceAppointments').getByRole('heading', { name: 'Service Appointments' })
        this.linkServiceAppointmentAvailability=page.getByRole('heading', { name: 'Service Appointments Availability' })
        this.linkSummary=page.getByRole('heading', { name: 'Summary' })
        this.linkWorkList=page.getByRole('heading', { name: 'Worklists' })

        this.linkRoomBooking=page.locator("xpath=//h1[normalize-space()='Room Bookings']")
        this.linkProvisionalAppointment=page.getByRole('button', { name: 'Provisional Appointments' })
        this.btnSearch=page.getByTestId('Search')
        this.txtStartDate=page.locator("xpath=//input[@id='serviceAppointmentStartDate']")
        this.txtEndDate=page.locator("xpath=//input[@id='serviceAppointmentEndDate']")
        this.linkAppType=page.getByRole('cell', { name: 'Type' }).getByTestId('Type')
        //this.linkAppType=page.getByRole('button', { name: 'New' })  
        this.dropdownAppTypePopup=page.getByTestId('appointmentType').getByLabel('Open')
        this.btnChangeAppTypePopup=page.getByTestId('Change')
        this.linkLocation=page.getByRole('button', { name: 'Cath Lab Location' })

        
        // Created filters locators.
        this.locationsInput = page.locator("xpath=//input[@id='locations']");
this.clinicTypeInput = page.locator("xpath=//input[@id='clinicType']");
this.roomsInput = page.locator("xpath=//input[@id='rooms']");
this.patientBarcodeInput = page.locator("xpath=//*[@id='Patient Barcode']");
this.identifierInput = page.locator("xpath=//input[@id='Identifier']");
this.patientFamilyNameInput = page.locator("xpath=//input[@id='Patient Family Name']");
this.statusInput = page.locator("xpath=//input[@id='status']");
this.fromInput = page.locator("xpath=//input[@id='from']");
this.toInput = page.locator("xpath=//input[@id='to']");
this.saveAsDefaultCheckbox = page.locator("xpath=//input[@name='saveAsDefault']");
this.searchButton = page.locator("xpath=//*[@data-testid='Search']");
this.clearButton = page.locator("xpath=//*[@data-testid='Clear']");
this.appointmentFor=page.locator("xpath=//div[@id='mui-component-select-appointmentsFor']")

        
    }

    async selectDropdownOption(inputLocator, optionText) {
    // Click to open listbox
    await inputLocator.click();

    // Wait for listbox to appear. MUI often uses ul[role=listbox] or div.popover
    // Wait for either role=listbox or any <ul> that appears
    const listboxSelector = "//ul[@role='listbox'] | //ul";
    try {
      await this.page.waitForSelector(listboxSelector, { timeout: 3000 });
    } catch (e) {
      // If listbox didn't appear, we'll try typing to open suggestions
      await inputLocator.type(optionText, { delay: 50 });
    }

    // Try to click exact-matching li first (normalize-space to ignore stray whitespace)
    const optionLocator = this.page.locator(`//li[normalize-space()="${optionText}"]`);
    if (await optionLocator.count() > 0) {
      await optionLocator.first().waitFor({ state: 'visible', timeout: 3000 });
      await optionLocator.first().click();
      return;
    }

    // Try contains() match (partial match)
    const partialOption = this.page.locator(`//li[contains(normalize-space(.), "${optionText}")]`);
    if (await partialOption.count() > 0) {
      await partialOption.first().waitFor({ state: 'visible', timeout: 3000 });
      await partialOption.first().click();
      return;
    }

    // Fallback: type and press Enter (works if typing filters and first item is match)
    await inputLocator.fill(optionText);
    await inputLocator.press('Enter');
  }

      async fillSearchFilters(data) {

         if (data.txtStartDate) {
        await this.selectDropdownOption(this.txtStartDate, data.txtStartDate);
    }
     
   // appointmentFor

     if (data.txtEndDate) {
        await this.selectDropdownOption(this.txtEndDate, data.txtEndDate);
    }
    if (data.locations) {
        await this.selectDropdownOption(this.locationsInput, data.locations);
    }
    if (data.clinicType) {
        await this.selectDropdownOption(this.clinicTypeInput, data.clinicType);
    }
    if (data.rooms) {
        await this.selectDropdownOption(this.roomsInput, data.rooms);
    }
   
    
    if (data.appointmentFor) {
        await this.selectDropdownOption(this.appointmentFor, data.appointmentFor);
        //await page.keyboard.press('Tab');
        await this.page.keyboard.press('Escape');

    }
    if (data.patientBarcode) {
        await this.patientBarcodeInput.fill(data.patientBarcode);
    }
    if (data.identifier) {
        await this.identifierInput.fill(data.identifier);
    }
    if (data.patientFamilyName) {
        await this.patientFamilyNameInput.fill(data.patientFamilyName);
    }
    if (data.status) {
        await this.statusInput.fill(data.status);
    }
    if (data.from) {
        await this.selectDropdownOption(this.fromInput, data.from);
       
    }
    if (data.to) {
         await this.selectDropdownOption(this.toInput, data.to);
       
    }
    if (data.saveDefault === true) {
        await this.saveAsDefaultCheckbox.check();
    }
}
    async clickOnChangeButton()
    {
        await this.btnChangeAppTypePopup.click(0)
    }

    async clickOnNewAppTypeLink()
    {
        await this.dropdownAppTypePopup.click()
        await this.page.getByRole('option', { name: 'Emergency' }).click()

    }
    async clickOnEmergencyAppTypeLink()
    {
        await this.dropdownAppTypePopup.click()
        await this.page.getByRole('option', { name: 'New', exact: true }).click()

    }
    async clickOnAppTypeLink()
    {
        await this.linkAppType.click()
    }
    async enterStartDate(startdate)
    {
        await this.txtStartDate.type(startdate)
    }
    async enterEndDate(enddate)
    {
        await this.txtEndDate.type(enddate)
    }
    

    async clickOnSeachButton()
    {
        await this.btnSearch.click()
    }

    async clickOnProvisionalAppLink()
    {
        await this.linkProvisionalAppointment.click()
    }

    async clickOnRoomBookingLink()
    {
        await this.linkRoomBooking.click()
    }
async clicOnBackButton()
{
    await this.btnBack.click()
}
}
module.exports=ServiceAppointment