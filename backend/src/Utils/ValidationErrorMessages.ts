const UserErrorMessages = {
    "number.base": "{{#label}} must be a number.",
    "number.integer": "{{#label}} must be an integer.",
    "string.base": "{{#label}} must be text.",
    "string.email": "{{#label}} must be a valid email address.",
    "any.required": "{{#label}} is required.",
    "string.length": "{{#label}} must be exactly 10 digits.",
    "any.only": "{{#label}} must be one of: user, employee, or manager.",
  };
  
  const AccountErrorMessages = {
    "number.base": "{{#label}} must be a number.",
    "number.integer": "{{#label}} must be an integer.",
    "any.required": "{{#label}} is required.",
    "any.only": "{{#label}} must be one of the allowed values.",
    "number.min": "{{#label}} cannot be less than the minimum limit.",
    "number.max": "{{#label}} cannot be greater than the maximum limit.",
    "string.base": "{{#label}} must be a string.",
  };
  
  const TransactionErrorMessages = {
    "number.base": "{{#label}} must be a number.",
    "number.integer": "{{#label}} must be an integer.",
    "any.required": "{{#label}} is required.",
    "any.only": "{{#label}} must be one of the allowed values.",
    "number.min": "{{#label}} cannot be less than the minimum amount.",
    "number.max": "{{#label}} cannot be greater than the maximum amount.",
  };
  
  const EmployeeErrorMessages = {
    "number.base": "{{#label}} must be a number.",
    "number.integer": "{{#label}} must be an integer.",
    "any.required": "{{#label}} is required.",
    "any.only": "{{#label}} must be one of the allowed values.",
    "number.positive": "{{#label}} must be a positive number.",
  };
  
  const BranchErrorMessages = {
    "number.base": "{{#label}} must be a number.",
    "number.integer": "{{#label}} must be an integer.",
    "any.required": "{{#label}} is required.",
    "string.base": "{{#label}} must be a string.",
  };
  
  export {
    UserErrorMessages,
    AccountErrorMessages,
    TransactionErrorMessages,
    EmployeeErrorMessages,
    BranchErrorMessages,
  };
  