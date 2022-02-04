const policyChecker = require("../src/policyChecker");
const fs = require("fs");
const filePath = "./policies.json";
var testData = JSON.parse(fs.readFileSync(filePath));
const { COLONEL, RANCHER } = require("./requirements");

testData.forEach((policy, index) => {
  console.log("Missing Fields for Policy " + index + ": ");

  //Update the insurance company array to include which companies you want to get quotes from
  const insuranceCompanies = [COLONEL];

  console.log(policyChecker(policy, insuranceCompanies));
  console.log();
});
