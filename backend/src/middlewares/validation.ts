// const schema = Joi.object({
//   fullName: Joi.string().required().label('Full name'),
//   email: Joi.string().email().required().label('Email address'),
//   mobile: Joi.string().length(10).required().label('Mobile number'),
//   role: Joi.string().valid('user', 'employee', 'manager').required().label('Role'),
// }).messages(UserErrorMessages);

import {
  PaymentMethod,
  TransactionType,
  AccountType,
  AccountStatus,
  EmployeePosition,
  EmployeeStatus,
  Role,
  TransactionStatus,
} from "@prisma/client";
import Joi from "joi";
import {
  UserErrorMessages,
  EmployeeErrorMessages,
  BranchErrorMessages,
  TransactionErrorMessages,
  AccountErrorMessages,
} from "../../Utils/ValidationErrorMessages";

// TypeScript interfaces
interface User {
  user_id?: string;
  full_name?: string;
  email?: string;
  password_hash: string;
  phone_number?: string;
  role?: "user" | "employee" | "manager";
  created_at?: Date;
}

interface Account {
  account_id?: number;
  user_id: number; // name of the account owner
  account_type: "savings" | "current" | "loan" | "fixed_deposit";
  balance: number;
  currency?: string;
  status?: "active" | "inactive" | "closed" | "progress";
  created_at?: Date;
}

interface Transaction {
  transaction_id: number;
  user_id: number;
  from_account?: string;
  to_account?: string;
  biller_name?: string;
  bill_account_no?: string;
  loan_id?: number;
  amount: number;
  transaction_type:
    | "deposit"
    | "withdrawal"
    | "transfer"
    | "bill_payment"
    | "loan_payment";
  payment_method:
    | "cash"
    | "card"
    | "bank_transfer"
    | "upi"
    | "cheque"
    | "auto_debit";
  status: "pending" | "successful" | "failed" | "reversed";
  created_at: Date;
}

interface Loan {
  loan_id: number;
  user_id: number;
  amount: number;
  interest_rate: number;
  tenure_months: number;
  status: "approved" | "pending" | "rejected";
  created_at: Date;
}

interface Employee {
  employee_id?: number;
  user_id: number;
  branch_id: number;
  position: EmployeePosition;
  salary: number;
  status?: EmployeeStatus;
  created_at?: Date;
}

interface Branch {
  branch_id?: number;
  branch_name: string;
  address: string;
  manager_id?: number | null;
  created_at?: Date;
}

// Joi schemas
const JoiUserSchema: Joi.ObjectSchema<User> = Joi.object({
  user_id: Joi.number().integer(),
  full_name: Joi.string(),
  email: Joi.string().email(),
  password_hash: Joi.string().required(),
  phone_number: Joi.string().length(10),
  role: Joi.valid(...Object.values(Role)),
  created_at: Joi.date().optional(),
}).messages(UserErrorMessages);

const JoiAccountSchema: Joi.ObjectSchema<Account> = Joi.object({
  account_id: Joi.number().integer(),
  user_id: Joi.number()
    .integer()
    .required()
    .external(async (value, helpers) => {
      if (value <= 0) {
        return helpers.error("any.invalid");
      }
      return value;
    }),
  account_type: Joi.string()
    .valid(...Object.values(AccountType))
    .required(),
  balance: Joi.alternatives().conditional(Joi.ref("account_type"), {
    switch: [
      {
        is: "savings",
        then: Joi.number().precision(2).min(1000).required(),
      },
      {
        is: "current",
        then: Joi.number().precision(2).min(0).default(0.0).required(),
      },
      {
        is: "loan",
        then: Joi.number().precision(2).max(0).default(0.0).required(),
      },
    ],
    otherwise: Joi.number().precision(2).required(), // Default case
  }),
  currency: Joi.string().default("INR"),
  status: Joi.string()
    .valid(...Object.values(AccountStatus))
    .default("active"),
  created_at: Joi.date().default(() => new Date()),
}).messages(AccountErrorMessages);

const JoiTransactionSchema: Joi.ObjectSchema<Transaction> = Joi.object({
  TransactionId: Joi.number().integer(),
  user_id: Joi.number().integer().required(),
  from_account: Joi.string().optional(),
  to_account: Joi.string().optional(),
  biller_name: Joi.string().optional(),
  bill_account_no: Joi.string().optional(),
  loan_id: Joi.number().integer().optional(),
  amount: Joi.alternatives().conditional(Joi.ref("transaction_type"), {
    switch: [
      {
        is: "deposit",
        then: Joi.alternatives().conditional(Joi.ref("payment_method"), {
          switch: [
            {
              is: "upi",
              then: Joi.number().precision(2).min(10).max(1000000).required(),
            },
            {
              is: "cash",
              then: Joi.number().precision(2).min(100).max(2000000).required(),
            },
            {
              is: "cheque",
              then: Joi.number().precision(2).min(500).max(10000000).required(),
            },
          ],
          otherwise: Joi.number().precision(2).min(100).max(1000000).required(),
        }),
      },
      {
        is: "withdrawal",
        then: Joi.alternatives().conditional(Joi.ref("payment_method"), {
          switch: [
            {
              is: "cash",
              then: Joi.number().precision(2).min(100).max(50000).required(),
            },
            {
              is: "cheque",
              then: Joi.number().precision(2).min(500).max(500000).required(),
            },
          ],
          otherwise: Joi.number().precision(2).min(100).max(50000).required(),
        }),
      },
      {
        is: "transfer",
        then: Joi.number().precision(2).min(500).max(10000000).required(),
      },
    ],
    otherwise: Joi.number().precision(2).required(), // Default case
  }),
  TransactionType: Joi.string().valid(...Object.values(TransactionType)),
  payment_method: Joi.string().valid(...Object.values(PaymentMethod)),
  status: Joi.string().valid(...Object.values(TransactionStatus)),
  created_at: Joi.date().default(() => new Date()),
}).messages(TransactionErrorMessages);

const JoiLoanSchema: Joi.ObjectSchema<Loan> = Joi.object({
  loan_id: Joi.number().integer(),
  user_id: Joi.number().integer().required(),
  amount: Joi.number().precision(2).min(1000).max(1000000).required(),
  interest_rate: Joi.number().precision(2).min(1).max(30).required(),
  // tenure: Joi.number().integer().min(1).max(60).required(), // in months
  tenure_months: Joi.alternatives()
    .try(
      Joi.number().valid(0), //✅If a user wants to pay in one go,they can set tenure 0.
      Joi.alternatives().conditional("loan_type", [
        { is: "home", then: Joi.number().min(60).max(360).required() }, // Home loan min 60 months (5 years)
        { is: "personal", then: Joi.number().min(12).max(84).required() }, // Personal loan min 12 months
        { is: "car", then: Joi.number().min(24).max(96).required() }, // Car loan min 24 months
        { is: "education", then: Joi.number().min(12).max(12).required() }, // Education loan min 12 months
      ])
    )
    .required(),
  status: Joi.string()
    .valid("approved", "pending", "rejected")
    .default("pending"),
  created_at: Joi.date().default(() => new Date()),
});

const JoiEmployeeSchema: Joi.ObjectSchema<Employee> = Joi.object({
  employee_id: Joi.number().integer(),
  user_id: Joi.number().integer().required(),
  branch_id: Joi.number().integer().required(),
  position: Joi.string()
    .valid(...Object.values(EmployeePosition))
    .required(),
  salary: Joi.number().precision(2).positive().required(),
  status: Joi.string()
    .valid(...Object.values(EmployeeStatus))
    .default("active"),
  created_at: Joi.date().default(() => new Date()),
}).messages(EmployeeErrorMessages);

const JoiBranchSchema: Joi.ObjectSchema<Branch> = Joi.object({
  branch_id: Joi.number().integer(),
  branch_name: Joi.string().required(),
  address: Joi.string().required(),
  manager_id: Joi.number().integer().allow(null),
  created_at: Joi.date().default(() => new Date()),
}).messages(BranchErrorMessages);

// Function to validate user data
function validateUser(data: unknown) {
  return JoiUserSchema.validateAsync(data)
    .then((validatedUser) => {
      console.log("Valid user data:", validatedUser);
      return validatedUser;
    })
    .catch((error) => {
      console.error("User validation error:", error);
      return null;
    });
}

// Function to validate account data
function validateAccount(data: unknown) {
  return JoiAccountSchema.validateAsync(data)
    .then((validatedAccount) => {
      console.log("Valid account data:", validatedAccount);
      return validatedAccount;
    })
    .catch((error) => {
      console.error("Account validation error:", error);
      return null;
    });
}

const data = {
  email: "invalid-email",
  password_hash: "",
};

async function validateUserData() {
  try {
    const validatedUser = await JoiUserSchema.validateAsync(data, {
      abortEarly: false,
    }); // Collect all errors)
    console.log("Valid user data:", validatedUser);
  } catch (error: any) {
    if (error.details) {
      console.error(
        "Validation Details:",
        error.details.map((err: any) => err.message)
      );
    }
  }
}
validateUserData();
// Validation Details: [
//   "email must be a valid email address",
//   "password_hash is required"
// ]


// ✅ Example: Use custom messages manually in controller
// If you want to return a manual error (e.g., based on some logic), you can just use your message map:
// import { UserErrorMessages } from "../../Utils/ValidationErrorMessages";

// if (!req.body.email) {
//   return res.status(400).json({
//     error: UserErrorMessages["any.required"].replace("{{#label}}", "Email address"),
//   });
// }


export {
  JoiUserSchema,
  JoiAccountSchema,
  JoiTransactionSchema,
  JoiEmployeeSchema,
  JoiBranchSchema,
  validateAccount,
  validateUser,
};
