import { validators } from "./Validators";

export class ValidationEngine {
  constructor() {
    this.rules = {};
  }

  // Add validation rules dynamically
  addRule(fieldName, validatorFn, errorMessage, options = {}) {
    if (!this.rules[fieldName]) {
      this.rules[fieldName] = [];
    }
    this.rules[fieldName].push({ validatorFn, errorMessage, ...options });
    return this;
  }

  // Validate a single field
  validateField(fieldName, value) {
    const fieldRules = this.rules[fieldName] || [];
    for (let rule of fieldRules) {
      // Check if the rule is required and value is missing
      if (rule.required && validators.required(value) === false) {
        return (
          rule.errorMessage ||
          "This field is required and cannot be left blank."
        );
      }
      if (!rule.validatorFn(value)) {
        return rule.errorMessage;
      }
    }
    return null; // No validation errors
  }

  // Validate the entire form
  validateForm(fields) {
    const errors = {};
    Object.keys(fields).forEach((fieldName) => {
      const errorMessage = this.validateField(fieldName, fields[fieldName]);
      if (errorMessage) {
        errors[fieldName] = errorMessage;
      }
    });
    return errors;
  }
}

// dynamic validation function

export const createValidationEngine = (dynamicRules = []) => {
  const engine = new ValidationEngine();

  // Adding default rules
  engine
    .addRule("email", validators.email, "Please enter a valid email address.")
    .addRule("phone", validators.phone, "Please enter a valid phone number.")
    .addRule("name", validators.name, "Please enter a valid name.")
    .addRule("pinCode", validators.pinCode, "Please enter a valid pin code.")
    .addRule("number", validators.number, "Please enter a valid numbers only.")
    .addRule("letter", validators.letter, "Please enter valid letters only.")
    .addRule(
      "required",
      validators.required,
      "This field is required and cannot be left blank."
    );

  // Add dynamic rules passed via props
  dynamicRules.forEach(({ fieldName, validatorFn, errorMessage }) => {
    engine.addRule(fieldName, validatorFn, errorMessage);
  });

  return engine;
};
