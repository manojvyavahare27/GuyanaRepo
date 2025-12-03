import { test, expect, Page, chromium } from "@playwright/test";

const convertExcelToJson = require("../../../config/global-setupOptimized");
const { executeQuery } = require("../../../databaseWriteFile");
import compareJsons from "../../../compareFileOrJson";

import LoginPage from "../../../Pages/BaseClasses/LoginPage";
import Homepage from "../../../Pages/BaseClasses/Homepage";
import PatientSearch from "../../../Pages/PatientDomain/PatientSearch";
import PatientDetails from "../../../Pages/PatientDomain/PatientDetails";
import Environment from "../../../Pages/BaseClasses/Environment";
import Menu from "../../../Pages/BaseClasses/Menu";
import PatientWizard from "../../../Pages/PatientDomain/PatientWizard";
import PatientDuplicateCheck from "../../../Pages/PatientDomain/PatientDuplicateCheck";
import Demographics from "../../../Pages/PatientDomain/Demographics";
import AddPatient from "../../../Pages/PatientDomain/AddPatient";
import AddAddress from "../../../Pages/PatientDomain/AddAddress";
import AddPIP from "../../../Pages/PatientDomain/AddPIP";
import ViewPIP from "../../../Pages/PatientDomain/ViewPIP";
import AddGP from "../../../Pages/PatientDomain/AddGP";
import PrintIDCard from "../../../Pages/PatientDomain/PrintIDCard";
import ConfirmExisting from "../../../Pages/PatientDomain/ConfirmExisting";
import TopBlueBar from "../../../Pages/BaseClasses/TopBlueBar";
import EditPatient from "../../../Pages/PatientDomain/EditPatient";
import AddReferral from "../../../Pages/PatientDomain/AddReferral";
import ServiceReferrals from "../../../Pages/ReferralDomain/ServiceReferrals";

const logindata = JSON.parse(JSON.stringify(require("../../../TestData/PatientDomain/Login.json")));
const patientdetailsdata = JSON.parse(JSON.stringify(require("../../../TestData/ReferralDomain/PatientDetails.json")));
const pipdetailsdata = JSON.parse(JSON.stringify(require("../../../TestData/PatientDomain/PIPDetails.json")));
const gpdata = JSON.parse(JSON.stringify(require("../../../TestData/PatientDomain/NewGPDetails.json")));

const consoleLogs = [];
let jsonData;

test.describe("Database Comparison Add New Referral", () => {
  test("Extract Patient Details", async ({}) => {
    const excelFilePath =
      process.env.EXCEL_FILE_PATH || "./ExcelFiles/ReferralDomain.xlsx";
    const jsonFilePath =
      "./TestDataWithJSON/ReferralDomain/ReferralDetails.json";
    const conversionSuccess = await convertExcelToJson(
      excelFilePath,
      jsonFilePath
    );

    if (conversionSuccess) {
      jsonData = require("../../../TestDataWithJSON/ReferralDomain/ReferralDetails.json");
      console.log("Excel file has been converted successfully!");
      console.log("jsonData:", jsonData); // Log the loaded JSON data
      console.log("excelFilePath after conversion:", excelFilePath);
      console.log("jsonFilePath after conversion:", jsonFilePath);
    } else {
      throw new Error("Excel to JSON conversion failed.");
    }
  });

  test("Add New Referral @Functional @ReferralDomain", async ({ page }) => {
    const loginpage = new LoginPage(page);
    const homepage = new Homepage(page);
    const environment = new Environment(page);
    const patientsearch = new PatientSearch(page);
    const serviceRef= new ServiceReferrals(page)
    const patientduplicatecheck = new PatientDuplicateCheck(page);
    const addpatient = new AddPatient(page);
    const addaddress = new AddAddress(page);
    const demogrphics = new Demographics(page);
    const addpip = new AddPIP(page);
    const viewpip = new ViewPIP(page);
    const addgp = new AddGP(page);
    const printidcard = new PrintIDCard(page);
    const confirmexisting = new ConfirmExisting(page);
    const menu = new Menu(page);
    const topbluebar = new TopBlueBar(page);
    const editpatient = new EditPatient(page);
    const addreferral = new AddReferral(page);

    let index = 0;

    await page.goto(environment.Test);
    await page.waitForTimeout(2000);
    await loginpage.enterUsername(jsonData.loginDetails[0].username);
    await page.waitForTimeout(2000);
    await loginpage.enter_Password(jsonData.loginDetails[0].password);
    await page.waitForTimeout(2000);
    await loginpage.clickOnLogin();
    await homepage.clickonSidebarHomeIcon();
    await homepage.clickOnPatientIcon();
    await patientsearch.clickOnSearchButton();
    await patientsearch.enterGivenName(jsonData.addPatient[index].pat_firstname.toString());
    await patientsearch.enterFamilyName(jsonData.addPatient[index].pat_surname.toString());

    
    await patientsearch.clickOnSearchButton();
    await page.pause()
    await patientsearch.clickOnSearchPatientLink();
     await confirmexisting.clickOnConfirmExistingDetails();
     await page.waitForTimeout(2000);
    await homepage.clickOnSideIconReferrals()
    await page.waitForTimeout(2000);

    // await serviceRef.clickOnLinks()
    // await serviceRef.clickOndiagnosisLink()
    // await serviceRef.clickOnBackButtonOnPopup()
    // await serviceRef.clickOnLinks()
    // await serviceRef.clickOndiagnosisLink()
    // await serviceRef.clickonClosePopup()


    // await serviceRef.clickOnLinks()
    // await serviceRef.clickOndocumentsLink()
    // await serviceRef.clickOnBackButtonOnPopup()
    //  await serviceRef.clickOnLinks()
    //  await serviceRef.clickOndocumentsLink()
    //  await serviceRef.clickonClosePopup()

// await serviceRef.openAndCloseLink(serviceRef.diagnosisLink);
// await serviceRef.openAndCloseLink(serviceRef.documentsLink);

const allLinks = [
    { locator: serviceRef.diagnosisLink, name: "diagnosis" },
    { locator: serviceRef.documentsLink, name: "documents" },
    { locator: serviceRef.examinationLink, name: "examination" },
    { locator: serviceRef.investigationLink, name: "investigation" },
    { locator: serviceRef.lifestyleLink, name: "lifestyle" },
    { locator: serviceRef.medicationLink, name: "medication" },
    { locator: serviceRef.overviewLink, name: "overview" },
    { locator: serviceRef.physicalsignsLink, name: "physical signs" },
    { locator: serviceRef.problemsLink, name: "problems" },
    { locator: serviceRef.proceduresLink, name: "procedures" },
    { locator: serviceRef.recommenationsLink, name: "recommendations" },
    { locator: serviceRef.riskLink, name: "risk" },
    { locator: serviceRef.scanLink, name: "scan" }
];

for (const item of allLinks) {
    await serviceRef.openAndCloseLink(item.locator, item.name);

    // 1 second wait after each item
    await page.waitForTimeout(1000);
}
    
    await serviceRef.clickOnLinks()     
  });
});
