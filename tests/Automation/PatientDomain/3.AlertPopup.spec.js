const fs = require("fs");
const XLSX = require("xlsx");
//const path = "D:/Riomed/Cellma4Automation";
const path = require('path');
const mysql = require("mysql2");
const convertExcelToJson = require('../../../config/global-setupOptimized');
const connectToDatabase = require("../../../manoj").default;
const { executeQuery } = require("../../../databaseWriteFile"); // Update the path accordingly
import compareJsons from "../../../compareFileOrJson";


import { test, expect, Page, chromium } from '@playwright/test';
import logger from '../../../Pages/BaseClasses/logger'
import LoginPage from '../../../Pages/BaseClasses/LoginPage';
import Homepage from '../../../Pages/BaseClasses/Homepage';
import PatientSearch from '../../../Pages/PatientDomain/PatientSearch';
import Alertpopup from '../../../Pages/PatientDomain/AlertPopup';


import Environment from '../../../Pages/BaseClasses/Environment';
import ConfirmExisting from "../../../Pages/PatientDomain/ConfirmExisting";

import PatientSummary from '../../../Pages/PatientDomain/PatientSummary'



const logindata = JSON.parse(JSON.stringify(require("../../../TestData/PatientDomain/Login.json")))
const patientdetailsdata = JSON.parse(JSON.stringify(require("../../../TestData/PatientDomain/PatientDetails.json")))
const pipdetailsdata = JSON.parse(JSON.stringify(require("../../../TestData/PatientDomain/PIPDetails.json")))
const gpdata = JSON.parse(JSON.stringify(require("../../../TestData/PatientDomain/NewGPDetails.json")))
//let jsonData = JSON.parse(JSON.stringify(require("../../../TestDataWithJSON/PatientDomain/PatientDetails.json")));

const consoleLogs = [];
let jsonData;



test.describe("Patient Domain Db Comparison", () => {

  test.beforeAll(async () => {
    const excelFilePath = process.env.EXCEL_FILE_PATH || "./ExcelFiles/PatientDomain.xlsx";
    const jsonFilePath = "./TestDataWithJSON/PatientDomain/PatientDetails.json";
    const conversionSuccess = await convertExcelToJson(excelFilePath, jsonFilePath);

    if (!conversionSuccess) {
      throw new Error("Excel to JSON conversion failed.");
    }

    jsonData = require("../../../TestDataWithJSON/PatientDomain/PatientDetails.json");
    console.log("Excel converted and JSON loaded successfully.");
  });


  
  test.describe('Pharmacy New Patient', () => {
    test('Pharmacy Register New Patient', async ({ page }) => {
      if (!jsonData || !jsonData.addPatient) {
        throw new Error('JSON data is missing or invalid.');
      }
      let index = 0
      for (const data of jsonData.addPatient) {
        const loginpage = new LoginPage(page)
        const homepage = new Homepage(page)
        const environment = new Environment(page)
        const patientsearch = new PatientSearch(page)   
         const confirmexisting = new ConfirmExisting(page);  
         const alertPopup =new Alertpopup(page)
         const patSummary =new PatientSummary(page)
                     
        await page.goto(environment.Test);
        await page.waitForTimeout(2000);
        await loginpage.enterUsername(jsonData.loginDetails[0].username);
        await page.waitForTimeout(2000);
        await loginpage.enter_Password(jsonData.loginDetails[0].password);
        await page.waitForTimeout(2000);
        await loginpage.clickOnLogin();
        
       
        //logger.info("Clicked on Login button successfully");
        await homepage.clickonSidebarHomeIcon()
        await homepage.clickOnPatientIcon()
        await patientsearch.clickOnSearchButton()
        await patientsearch.enterGivenName(jsonData.Alerts[index].pat_firstname.toString());
        await patientsearch.enterFamilyName(jsonData.Alerts[index].pat_surname.toString());
        await patientsearch.clickOnSearchButton()
        await page.waitForTimeout(2500)
       
        await patientsearch.clickOnSearchPatientLink()
        await page.waitForTimeout(1500);
      //await page.pause()
      await confirmexisting.clickOnConfirmExistingDetails();  

      //  await patSummary.clickOnAlertIcon()

       await alertPopup.clickOnShowFiltersLink()
         await page.waitForTimeout(1500);
       await alertPopup.clickOnHideFiltersLink()
         await page.waitForTimeout(1500);
        await alertPopup.clickOnShowFiltersLink()
            await page.waitForTimeout(1500);
            
        await alertPopup.clickAllAlerts()
        await alertPopup.clickActive()
        await alertPopup.clickHidden()
        await alertPopup.clickSeen()        
        await alertPopup.clickExpired()
        await alertPopup.clickPinned()
        await alertPopup.clickProfile()

        await alertPopup.clickActive()
        await alertPopup.clickOnShowFiltersLink()
             
        await alertPopup.setStartDate("24/11/2025")
        await alertPopup.setEndDate("26/11/2025")
        await alertPopup.clickSearch()

        await alertPopup.setPriority()
        await alertPopup.clickSearch()

        await alertPopup.clickReset()


       
       await alertPopup.setEndDate("26/11/2025")
       await alertPopup.setDescription('Rectoplasty')
       await alertPopup.clickSearch()
       await alertPopup.clickReset()
        await alertPopup.setEndDate("26/11/2025")
        await alertPopup.setPriority()
        await alertPopup.setDescription('Rectoplasty')
        await alertPopup.clickSearch()
        await alertPopup.setCategory()
        await alertPopup.clickSearch()
        await alertPopup.clickReset()

        await alertPopup.setStartDate("")
        await alertPopup.setEndDate("")
        await page.pause()
        await page.waitForTimeout(2000)
        await alertPopup.setDaysSelected()

        await expect(alertPopup.startDateInput).toBeDisabled();
    await expect(alertPopup.endDateInput).toBeDisabled();


        await alertPopup.clickSearch()
        await alertPopup.clickReset()
 await page.pause()

        // await menu.clickOnLogout();      

      }
    }); // <-- ✅ This closes test('Pharmacy Register New Patient')
  });
  });