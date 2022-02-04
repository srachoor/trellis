<h1>Policy Field Checker</h1>

<h2>Instructions</h2>

1. After downloading and unzipping the zip file, navigate to the trellis folder in your command terminal
2. Install node_modules by running the command: `npm install`
3. Open and edit file `trellis/src/policies.json` to edit/update the array of policies (currently includes the sample data inq json)
4. Edit/update the `insuranceCompanies` array in `index.js` file (line 11) for the insurance companies you would like to receive quotes from. This can be an array of either The Colonel Insurance, Ranchers Insurance, or both.
5. Navigate to the `src` folder in your terminal, and run index.js by typing `node index.js`
   - Please note that if you try to run this in VScode without the command line, you need to change the variable `filePath` in the file `index.js` to be `"src/policies.json"` instead of `"./policies.json"`. If you stick with the command line `node index.js` command, you won't need to change anything.
6. Output will include missing fields for each policy in the array.

<h2>Methodology</h2>

- The problem was broken down into two pieces, which was largely driven by the structure of the "Data Definition" provided. It was clear that there were `Policy Holder` and `Operator` details that were needed.
- Since there was a `Policy Holder` object and separately an array of `Operators`, I decided to break it up into two problems: 1 for `Policy Holder` and 1 for `Operators`.

<h3>Policy Holders</h3>

- The `Policy Holder` methods check to see if the data from API has the following fields. These were the fields that were <b>assumed</b> to be business critical for what constituted a "name" and an "address".
  - "policyHolder.name.firstName"
  - "policyHolder.name.lastName"
  - "policyHolder.address.number"
  - "policyHolder.address.street"
  - "policyHolder.address.type"
  - "policyHolder.address.city"
  - "policyHolder.address.state"
  - "policyHolder.address.zip"
  - "policyHolder.email"
  - "policyHolder.phoneNumber" (Only for Ranchers Insurance)
- Some of the `Policy Holder` fields also had helper functions created such as `checkEmail()` and `checkPhone()` that used regular expressions to validate whether the API returned correct emails and phone number values.

<h3>Operators</h3>

- The `Operator` methods check to see if the data from the API has the following fields -- one set of requirements for the primary driver (aka the policy holder) and one set of requirements for all other drivers
  - Primary Driver:
    - "driversLicenseNumber"
    - "dob" (This came with a helper function that looked for "birthdayRange.start" and "birthdayRange.end")
    - "gender" (only for The Colonel Insurance)
  - Other Drivers:
    - "driversLicenseNumber" (only for Ranchers Insurance)
    - "dob" (This came with a helper function that looked for "birthdayRange.start" and "birthdayRange.end")
    - "gender" (only for The Colonel Insurance)
- Once again, some of the `Operator` fields had helper functions such as `checkDOB()` which validated whether the start and end ranges of a birthday were the same day. If they were not, the date of birth would need to be requested. Similarly, the `checkDL()` helper function verified whether a DL started with a "D" or not. If it did not start with a "D", then the drivers license number would need to be requested. <b>Please note that this is an over-simplificiation of the DL formats. In reality, every state has a different and unique format and they don't always start with "D". This was an assumption for the exercise.</b>

<h2>Considerations</h2>

<h3>Multiple Insurance Quotes</h3>

- To make the functionality of the application scaleable to include more than one insurance company, I utilized a `requirements.js` file that includes a list of fields and its respective helper functions based on each company's requirements. This way, if an insurance company ever to update its requirements or we need to add additional insurance companies, it's very easy to do so.
- My one change I would have made (if I had more time) would have been to dedupe the requirements instead of deduping the missing fields retrieved. This way, I would only need to review the policy once instead of reviewing the policy for company 1's requirements, then reviewing the policy for company 2's requirements, then deduping the values.

<h3>Programmatic, Online Interview Flow</h3>

- If I had more time, I would have mapped each missing field to a question, and return a list of questions.

So it would have replaced the following return value...
```
[
  { value: 'driversLicenseNumber', missing_for: 'Catherine Harris' },
  { value: 'dob', missing_for: 'Catherine Harris' }
]
```

... with the following:

```
[
    "Please provide the driver's license number for Catherine Harris.",
    "Please provide the date of birth for Catherine Harris."
]
```

<h2>Testing</h2>

  - I have included a testing suite that can be run using the command `npm run test`. I added three tests but you can provide more tests to verify that it works as expected.
  - Feel free to edit / add tests in the `test` folder.

Thanks for the coding challenge -- it was a great learning experience and thought exercise! 

