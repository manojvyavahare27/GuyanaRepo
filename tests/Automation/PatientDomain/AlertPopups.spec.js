import { test, expect } from '@playwright/test';

const convertExcelToJson = require('../../../config/global-setupOptimized');

import LoginPage from '../../../Pages/BaseClasses/LoginPage';
import Homepage from '../../../Pages/BaseClasses/Homepage';
import PatientSearch from '../../../Pages/PatientDomain/PatientSearch';
import Alertpopup from '../../../Pages/PatientDomain/AlertPopup';
import Environment from '../../../Pages/BaseClasses/Environment';
import ConfirmExisting from "../../../Pages/PatientDomain/ConfirmExisting";
import PatientSummary from '../../../Pages/PatientDomain/PatientSummary';

let jsonData;

test.describe("Patient Alert Popup", () => {

  // ----------------------------
  // BEFORE ALL → Load JSON Data
  // ----------------------------
  test.beforeAll(async () => {
    const excelFilePath = process.env.EXCEL_FILE_PATH || "./ExcelFiles/PatientDomain.xlsx";
    const jsonFilePath = "./TestDataWithJSON/PatientDomain/PatientDetails.json";

    const converted = await convertExcelToJson(excelFilePath, jsonFilePath);
    if (!converted) throw new Error("Excel → JSON conversion failed.");

    jsonData = require("../../../TestDataWithJSON/PatientDomain/PatientDetails.json");
  });


  let loginpage, homepage, environment, patientsearch, confirmexisting, alertPopup;


  // -----------------------------------------------------
  // BEFORE EACH → Login → Navigate → Open Alerts Popup
  // -----------------------------------------------------
  test.beforeEach(async ({ page }) => {

    loginpage = new LoginPage(page);
    homepage = new Homepage(page);
    environment = new Environment(page);
    patientsearch = new PatientSearch(page);
    confirmexisting = new ConfirmExisting(page);
    alertPopup = new Alertpopup(page);

    let index = 0; // Use first patient row

    // Login
    await page.goto(environment.Test);
    await loginpage.enterUsername(jsonData.loginDetails[0].username);
    await loginpage.enter_Password(jsonData.loginDetails[0].password);
    await loginpage.clickOnLogin();

    // Navigate to patient
    await homepage.clickonSidebarHomeIcon();
    await homepage.clickOnPatientIcon();
    await patientsearch.clickOnSearchButton();

    await patientsearch.enterGivenName(jsonData.Alerts[index].pat_firstname.toString());
    await patientsearch.enterFamilyName(jsonData.Alerts[index].pat_surname.toString());
    await patientsearch.clickOnSearchButton();

    await patientsearch.clickOnSearchPatientLink();
    await confirmexisting.clickOnConfirmExistingDetails();

    // Open Alerts section
    await alertPopup.clickOnShowFiltersLink();
  });


  // =======================================================
  //   TEST 1 → VALIDATE ALERTS TABS NAVIGATION
  // =======================================================
  test("Verify Alerts Tab Navigation", async ({ page }) => {

    await alertPopup.clickAllAlerts();
    await alertPopup.clickActive();
    await alertPopup.clickHidden();
    await alertPopup.clickSeen();
    await alertPopup.clickExpired();
    await alertPopup.clickPinned();
    await alertPopup.clickProfile();

    await alertPopup.clickActive();
    await alertPopup.clickOnShowFiltersLink();
  });


  // =======================================================
  //   TEST 2 → VALIDATE FILTERS, RESET, DISABLED STATE
  // =======================================================
  test("Verify Filters, Reset and Disabled Fields", async ({ page }) => {

    await alertPopup.setStartDate("24/11/2025");
    await alertPopup.setEndDate("26/11/2025");
    await alertPopup.clickSearch();

    await alertPopup.setPriority();
    await alertPopup.clickSearch();

    await alertPopup.clickReset();

    await alertPopup.setEndDate("26/11/2025");
    await alertPopup.setDescription("Rectoplasty");
    await alertPopup.clickSearch();

    await alertPopup.clickReset();

    await alertPopup.setEndDate("26/11/2025");
    await alertPopup.setPriority();
    await alertPopup.setDescription("Rectoplasty");
    await alertPopup.clickSearch();

    await alertPopup.setCategory();
    await alertPopup.clickSearch();
    await alertPopup.clickReset();

    // Clear dates
    await alertPopup.setStartDate("");
    await alertPopup.setEndDate("");

    // Select days — it should disable start & end dates
    await alertPopup.setDaysSelected();

    await expect(alertPopup.startDateInput).toBeDisabled();
    await expect(alertPopup.endDateInput).toBeDisabled();

    await alertPopup.clickSearch();
    await alertPopup.clickReset();
    await page.pause()
    await page.locator('.MuiFormControlLabel-root.MuiFormControlLabel-labelPlacementStart > .MuiButtonBase-root > .PrivateSwitchBase-input').first().click()
    await page.locator('.MuiFormControlLabel-root.MuiFormControlLabel-labelPlacementStart > .MuiButtonBase-root > .PrivateSwitchBase-input').first().click()
   
    await page.locator('div:nth-child(3) > .MuiFormControl-root > .MuiFormControlLabel-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click()
    await page.locator('div:nth-child(3) > .MuiFormControl-root > .MuiFormControlLabel-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click()
    
    await page.pause()
    // const pinIcon = page.locator("//div[contains(@class,'MuiDataGrid-row')][.//h1[contains(text(),'Rectoplasty')]]//svg[@data-testid='PushPinIcon']");
    // await pinIcon.click();
     await page.pause()
     await alertPopup.toggleSortByCriticality()
      await alertPopup.toggleSortByCriticality()
      await page.pause()
      await alertPopup.clickOnSaveButton()
      await expect(page.getByText("Alert updated successfully")).toBeVisible();

  });



});
