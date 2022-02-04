const policyChecker = require("../src/policyChecker");
const fs = require("fs");
const filePath = "./test/policies.test.json";
var testData = JSON.parse(fs.readFileSync(filePath));

//test for missing policy holder fields
test("Missing address type, driver's license, DOB, and phone number", () => {
  const policy = testData[0]; //Arrange
  const insuranceCompanies = ["The Colonel Insurance", "Rancher Insurance"]; //Arrange
  const expected = [
    { value: "policyHolder.address.type", missing_for: "Caroline White" },
    { value: "driversLicenseNumber", missing_for: "Caroline White" },
    { value: "dob", missing_for: "Caroline White" },
    { value: "policyHolder.phoneNumber", missing_for: "Caroline White" }
  ]; //Arrange

  const x = policyChecker(policy, insuranceCompanies); //Act

  expect(x).toStrictEqual(expected); //Assert
});

//Test for missing fields for multiple drivers
test("Missing fields for multiple drivers", () => {
  const policy = testData[2]; //Arrange
  const insuranceCompanies = ["The Colonel Insurance", "Rancher Insurance"]; //Arrange
  const expected = [
    { value: "dob", missing_for: "Charlotte Martin" },
    { value: "dob", missing_for: "Homer Martin" },
    { value: "dob", missing_for: "Joshua Martin" }
  ]; //Arrange

  const x = policyChecker(policy, insuranceCompanies); //Act

  expect(x).toStrictEqual(expected); //Assert
});

//Test for all missing fields
test("Missing policy holder and operator fields", () => {
  const policy = testData[25]; //Arrange
  const insuranceCompanies = ["The Colonel Insurance", "Rancher Insurance"]; //Arrange
  const expected = [
    {
      value: "policyHolder.name.firstName",
      missing_for: "Policy Holder"
    },
    { value: "policyHolder.name.lastName", missing_for: "Policy Holder" },
    {
      value: "policyHolder.address.number",
      missing_for: "Policy Holder"
    },
    {
      value: "policyHolder.address.street",
      missing_for: "Policy Holder"
    },
    { value: "policyHolder.address.type", missing_for: "Policy Holder" },
    { value: "policyHolder.address.city", missing_for: "Policy Holder" },
    { value: "policyHolder.address.state", missing_for: "Policy Holder" },
    { value: "policyHolder.address.zip", missing_for: "Policy Holder" },
    { value: "policyHolder.email", missing_for: "Policy Holder" },
    { value: "driversLicenseNumber", missing_for: "Policy Holder" },
    { value: "dob", missing_for: "Policy Holder" },
    { value: "gender", missing_for: "Policy Holder" },
    { value: "policyHolder.phoneNumber", missing_for: "Policy Holder" }
  ]; //Arrange

  const x = policyChecker(policy, insuranceCompanies); //Act

  expect(x).toStrictEqual(expected); //Assert
});
