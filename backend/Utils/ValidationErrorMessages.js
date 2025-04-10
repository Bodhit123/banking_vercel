"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchErrorMessages = exports.EmployeeErrorMessages = exports.TransactionErrorMessages = exports.AccountErrorMessages = exports.UserErrorMessages = void 0;
var UserErrorMessages = {
    "number.base": "User ID must be a number.",
    "number.integer": "User ID must be an integer.",
    "string.base": "Full name must be a string.",
    "string.email": "Email must be a valid email address.",
    "any.required": "{{#label}} is required.",
    "string.length": "Phone number must be exactly 10 digits.",
    "any.only": "Role must be one of the following: user, employee, or manager.",
};
exports.UserErrorMessages = UserErrorMessages;
var AccountErrorMessages = {
    "number.base": "{{#label}} must be a number.",
    "number.integer": "{{#label}} must be an integer.",
    "any.required": "{{#label}} is required.",
    "any.only": "{{#label}} must be one of the allowed values.",
    "number.min": "{{#label}} cannot be less than {{#limit}}.",
    "number.max": "{{#label}} cannot be greater than {{#limit}}.",
    "string.base": "{{#label}} must be a string.",
};
exports.AccountErrorMessages = AccountErrorMessages;
var TransactionErrorMessages = {
    "number.base": "{{#label}} must be a number.",
    "number.integer": "{{#label}} must be an integer.",
    "any.required": "{{#label}} is required.",
    "any.only": "{{#label}} must be one of the allowed values.",
    "number.min": "{{#label}} cannot be less than {{#limit}}.",
    "number.max": "{{#label}} cannot be greater than {{#limit}}.",
};
exports.TransactionErrorMessages = TransactionErrorMessages;
var EmployeeErrorMessages = {
    "number.base": "{{#label}} must be a number.",
    "number.integer": "{{#label}} must be an integer.",
    "any.required": "{{#label}} is required.",
    "any.only": "{{#label}} must be one of the allowed values.",
    "number.positive": "{{#label}} must be a positive number.",
};
exports.EmployeeErrorMessages = EmployeeErrorMessages;
var BranchErrorMessages = {
    "number.base": "{{#label}} must be a number.",
    "number.integer": "{{#label}} must be an integer.",
    "any.required": "{{#label}} is required.",
    "string.base": "{{#label}} must be a string.",
};
exports.BranchErrorMessages = BranchErrorMessages;
