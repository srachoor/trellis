const lodash = require("lodash");
const {
  colonelPolicyHolderRequirements,
  rancherPolicyHolderRequirements,
  colonelPrimaryOperatorRequirements,
  colonelAllOperatorRequirements,
  rancherPrimaryOperatorRequirements,
  rancherAllOperatorRequirements,
  COLONEL,
  RANCHER
} = require("./requirements");

//This function takes in a policy and a list of insurance companies with whom we'd like to get a quote estimate.
const policyChecker = (
  policy,
  insuranceCompanies = ["The Colonel Insurance"]
) => {
  let missingFields = [];

  //For each insurance company, we will check to see if fields are missing in the policy
  insuranceCompanies.forEach((insuranceCompany) => {
    missingFields = [
      ...missingFields,
      ...checkPolicyHolder(policy, insuranceCompany),
      ...checkOperators(policy.operators, insuranceCompany)
    ];
  });

  //De-duplicate any fields that get caught twice
  //If I had more time, I would have de-duped the requirements from all the insurance companies instead of de-duping the results. It would be more efficient.
  const uniqueFields = missingFields.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      missingFields.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });

  return uniqueFields;
};

module.exports = policyChecker;

//Switch to choose the policy holder requirements based on insurance company
const checkPolicyHolder = (policy, insuranceCompany) => {
  switch (insuranceCompany) {
    case COLONEL:
      return checkPolicyFields(policy, colonelPolicyHolderRequirements);
    case RANCHER:
      return checkPolicyFields(policy, rancherPolicyHolderRequirements);
  }
};

//this function breaks an operator array into the policy holder and other drivers and finds the appropriate required fields that are missing for the policy holder and other drivers.
const checkOperators = (operators, insuranceCompany) => {
  //if operators were not included in the API, return the policy holder requirements for the primary operator
  if (operators === undefined) {
    const result = chooseCompanyOperatorRequirements(insuranceCompany)[0];
    resultCopy = JSON.parse(JSON.stringify(result));
    resultCopy.forEach((requirement) => {
      delete requirement.checker;
      requirement.missing_for = "Policy Holder";
    });
    return resultCopy;
  }

  let missingFields = [];

  //filter for the primary operator (aka policy holder)
  const policyHolder = operators.filter((operator) => {
    return operator.isPrimary === true;
  })[0];

  //filter for non-primary operators
  const otherDrivers = operators.filter((operator) => {
    return operator.isPrimary === false;
  });

  //identify and missing operator fields for policy holder (aka primary operator)
  missingFields = [
    ...checkOperatorFields(
      policyHolder,
      chooseCompanyOperatorRequirements(insuranceCompany)[0]
    )
  ];

  //identify and missing operator fields for other operators / drivers
  otherDrivers.forEach((otherDriver) => {
    missingFields = [
      ...missingFields,
      ...checkOperatorFields(
        otherDriver,
        chooseCompanyOperatorRequirements(insuranceCompany)[1]
      )
    ];
  });

  return missingFields;
};

//Switch to choose the operator requirements by insurance company
const chooseCompanyOperatorRequirements = (insuranceCompany) => {
  switch (insuranceCompany) {
    case COLONEL:
      return [
        colonelPrimaryOperatorRequirements,
        colonelAllOperatorRequirements
      ];
    case RANCHER:
      return [
        rancherPrimaryOperatorRequirements,
        rancherAllOperatorRequirements
      ];
  }
};

//this function checks policy holder fields for each policy vs. the requirements for the company
const checkPolicyFields = (policy, requirements) => {
  const result = requirements.filter((policyField) => {
    const fieldValue = lodash.get(policy, policyField.value);
    const checkerFunction = policyField.checker;

    if (checkerFunction !== undefined) {
      return fieldValue === undefined || !checkerFunction(fieldValue);
    }
    return fieldValue === undefined;
  });
  resultCopy = JSON.parse(JSON.stringify(result));
  resultCopy.forEach((missingField) => {
    delete missingField.checker;
    missingField.missing_for =
      (policy?.policyHolder?.name?.firstName
        ? policy?.policyHolder?.name?.firstName + " "
        : "Policy Holder") +
      (policy?.policyHolder?.name?.lastName
        ? policy?.policyHolder?.name?.lastName
        : "");
  });
  return resultCopy;
};

//this function checks operator fields for each policy vs. the requirements for the company
//dob is the only field that required special attention as the check involved two fields instead of just one
const checkOperatorFields = (operator, requirements) => {
  const result = requirements.filter((operatorField) => {
    if (operatorField.value === "dob") {
      const dob_start = lodash.get(operator, "birthdayRange.start");
      const dob_end = lodash.get(operator, "birthdayRange.end");
      const checkerFunction = operatorField.checker;
      return !checkerFunction(dob_start, dob_end);
    } else {
      const fieldValue = lodash.get(operator, operatorField.value);
      const checkerFunction = operatorField.checker;

      if (checkerFunction !== undefined) {
        return fieldValue === undefined || !checkerFunction(fieldValue);
      }
      return fieldValue === undefined;
    }
  });
  resultCopy = JSON.parse(JSON.stringify(result));
  resultCopy.forEach((missingField) => {
    missingField.missing_for =
      operator.name.firstName + " " + operator.name.lastName;
    delete missingField.checker;
  });
  return resultCopy;
};
