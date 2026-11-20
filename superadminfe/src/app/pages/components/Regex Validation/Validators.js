export const validators = {
  email: (value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
      ? ""
      : "Please enter a valid email address. Example: name@example.com.",
  phone: (value) =>
    /^\+?[0-9]{10,15}$/.test(value)
      ? ""
      : "Mobile Number must be between 9 to 15 digits",
  name: (value) =>
    /^[a-zA-Z\s]{2,}$/.test(value) ? "" : "Please enter a valid input",
  number: (value) =>
    /^\d+$/.test(value)
      ? ""
      : "Please enter only Number, without any letters or special characters.",
  letter: (value) =>
    /^[a-zA-Z]+$/.test(value)
      ? ""
      : "Please enter only letters, without any numbers or special characters.",
  pinCode: (value) => /^[1-9][0-9]{5}$/.test(value),
  required: (value) => value !== undefined && value !== null && value !== "",
  customRegex: (value, regex) => regex.test(value),
};
