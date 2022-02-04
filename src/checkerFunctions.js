const checkEmail = (email) => {
  {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
};

const checkPhone = (phoneNumber) => {
  var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(phoneNumber);
};

const checkDL = (dlNumber) => {
  if (dlNumber === null || dlNumber.charAt(0) !== "D") {
    return false;
  }
  return true;
};

const checkDOB = (dob_start, dob_end) => {
  if (
    dob_start !== dob_end ||
    dob_start === undefined ||
    dob_end === undefined
  ) {
    return false;
  } else {
    return true;
  }
};

module.exports = { checkDL, checkDOB, checkEmail, checkPhone };
