// const UserErrorMessages = {
//   "number.base": "User ID must be a number.",
//   "number.integer": "User ID must be an integer.",
//   "string.base": "{{#label}} must be text.",
//   "string.email": "Email must be valid.",
//   "any.required": "{{#label}} is required.",
//   "string.length": "Phone number must be 10 digits.",
//   "any.only": "Role must be user, employee, or manager.",
// }; can also use label if you want to use the field name in the error message.

// Add custom validation error messages for each schema with full field labels
const UserErrorMessages = {
  "number.base": "Mobile number must be a number.",
  "number.integer": "Mobile number must be an integer.",
  "string.base": "Full name and email must be a string.",
  "string.email": "Email address must be a valid email.",
  "any.required": "This field is required.",
  "string.length": "Mobile number must be exactly 10 digits.",
  "any.only": "Role must be one of: user, employee, or manager.",
};

const AccountErrorMessages = {
  "number.base": "Account number and balance must be a number.",
  "number.integer": "Account number must be an integer.",
  "any.required": "This field is required.",
  "any.only": "Account type must be one of the allowed values.",
  "number.min": "Balance cannot be less than the minimum limit.",
  "number.max": "Balance cannot be greater than the maximum limit.",
  "string.base": "Account holder name must be a string.",
};

const TransactionErrorMessages = {
  "number.base": "Transaction amount and IDs must be numbers.",
  "number.integer": "Transaction ID must be an integer.",
  "any.required": "This field is required.",
  "any.only": "Transaction type must be one of the allowed values.",
  "number.min": "Transaction amount cannot be less than the minimum.",
  "number.max": "Transaction amount cannot be greater than the maximum.",
};

const EmployeeErrorMessages = {
  "number.base": "Employee ID and salary must be numbers.",
  "number.integer": "Employee ID must be an integer.",
  "any.required": "This field is required.",
  "any.only": "Role or department must be one of the allowed values.",
  "number.positive": "Salary must be a positive number.",
};

const BranchErrorMessages = {
  "number.base": "Branch ID and PIN code must be numbers.",
  "number.integer": "Branch ID must be an integer.",
  "any.required": "This field is required.",
  "string.base": "Branch name and address must be strings.",
};

export {
  UserErrorMessages,
  AccountErrorMessages,
  TransactionErrorMessages,
  EmployeeErrorMessages,
  BranchErrorMessages,
};
