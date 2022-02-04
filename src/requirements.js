const COLONEL = "The Colonel Insurance";
const RANCHER = "Rancher Insurance";

const {
  checkDL,
  checkDOB,
  checkEmail,
  checkPhone
} = require("./checkerFunctions");

const colonelPolicyHolderRequirements = [
  { value: "policyHolder.name.firstName" },
  { value: "policyHolder.name.lastName" },
  { value: "policyHolder.address.number" },
  { value: "policyHolder.address.street" },
  { value: "policyHolder.address.type" },
  { value: "policyHolder.address.city" },
  { value: "policyHolder.address.state" },
  { value: "policyHolder.address.zip" },
  { value: "policyHolder.email", checker: checkEmail }
];

const rancherPolicyHolderRequirements = [
  ...colonelPolicyHolderRequirements,
  { value: "policyHolder.phoneNumber", checker: checkPhone }
];

const colonelPrimaryOperatorRequirements = [
  { value: "driversLicenseNumber", checker: checkDL },
  { value: "dob", checker: checkDOB },
  { value: "gender" }
];

const colonelAllOperatorRequirements = [
  { value: "dob", checker: checkDOB },
  { value: "gender" }
];

const rancherPrimaryOperatorRequirements = [
  { value: "driversLicenseNumber", checker: checkDL },
  { value: "dob", checker: checkDOB }
];

const rancherAllOperatorRequirements = [
  { value: "driversLicenseNumber", checker: checkDL },
  { value: "dob", checker: checkDOB }
];

module.exports = {
  colonelPolicyHolderRequirements,
  rancherPolicyHolderRequirements,
  colonelPrimaryOperatorRequirements,
  colonelAllOperatorRequirements,
  rancherPrimaryOperatorRequirements,
  rancherAllOperatorRequirements,
  COLONEL,
  RANCHER
};
