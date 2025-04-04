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
  account_type: "savings" | "checking" | "loan";
  balance: number;
  currency?: string;
  status?: "active" | "inactive" | "suspended" | "closed";
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
  payment_method: "cash" | "card" | "bank_transfer" | "mobile_wallet";
  status: "pending" | "successful" | "failed";
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
});

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
  balance: Joi.alternatives().conditional("account_type", [
    {
      is: "savings",
      then: Joi.number().precision(2).min(1000).required(),
    },
    {
      is: "checking",
      then: Joi.number().precision(2).min(0).default(0.0).required(),
    },
    {
      is: "loan",
      then: Joi.number().precision(2).max(0).default(0.0).required(),
    },
  ]),
  currency: Joi.string().default("INR"),
  status: Joi.string()
    .valid(...Object.values(AccountStatus))
    .default("active"),
  created_at: Joi.date().default(() => new Date()),
});

const JoiTransactionSchema: Joi.ObjectSchema<Transaction> = Joi.object({
  TransactionId: Joi.number().integer(),
  user_id: Joi.number().integer().required(),
  from_account: Joi.string().optional(),
  to_account: Joi.string().optional(),
  biller_name: Joi.string().optional(),
  bill_account_no: Joi.string().optional(),
  loan_id: Joi.number().integer().optional(),
  amount: Joi.alternatives().conditional("transaction_type", [
    {
      is: "deposit",
      then: Joi.alternatives().conditional("payment_method", [
        {
          is: "upi",
          then: Joi.number().precision(2).min(10).max(1000000).required(),
        }, // UPI min ₹10
        {
          is: "cash",
          then: Joi.number().precision(2).min(100).max(2000000).required(),
        }, // Cash deposits
        {
          is: "cheque",
          then: Joi.number().precision(2).min(500).max(10000000).required(),
        }, // Cheque deposits
        {
          otherwise: Joi.number().precision(2).min(100).max(1000000).required(),
        }, // Default deposit limits
      ]),
    },
    {
      is: "withdrawal",
      then: Joi.alternatives().conditional("payment_method", [
        {
          is: "cash",
          then: Joi.number().precision(2).min(100).max(50000).required(),
        }, // ATM/Bank Counter
        {
          is: "cheque",
          then: Joi.number().precision(2).min(500).max(500000).required(),
        }, // Cheque withdrawals
        { otherwise: Joi.number().precision(2).min(100).max(50000).required() }, // Default withdrawal
      ]),
    },
    {
      is: "transfer",
      then: Joi.alternatives().conditional("payment_method", [
        {
          is: "upi",
          then: Joi.number().precision(2).min(1).max(500000).required(),
        }, // UPI min ₹1
        {
          is: "transfer",
          then: Joi.number().precision(2).min(500).max(10000000).required(),
        }, // Bank transfer
        {
          otherwise: Joi.number().precision(2).min(500).max(500000).required(),
        }, // Default transfer limits
      ]),
    },
    {
      is: "bill_payment",
      then: Joi.number().precision(2).min(50).max(200000).required(),
    },
    {
      is: "loan_payment",
      then: Joi.number().precision(2).min(1000).max(1000000).required(),
    },
    {
      is: "auto_debit",
      then: Joi.number().precision(2).min(50).max(500000).required(), // Auto-debit limits
    },
  ]),

  TransactionType: Joi.string().valid(...Object.values(TransactionType)),
  payment_method: Joi.string().valid(...Object.values(PaymentMethod)),
  status: Joi.string().valid(...Object.values(TransactionStatus)),
  created_at: Joi.date().default(() => new Date()),
});

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
});

const JoiBranchSchema: Joi.ObjectSchema<Branch> = Joi.object({
  branch_id: Joi.number().integer(),
  branch_name: Joi.string().required(),
  address: Joi.string().required(),
  manager_id: Joi.number().integer().allow(null),
  created_at: Joi.date().default(() => new Date()),
});

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

export {
  JoiUserSchema,
  JoiAccountSchema,
  JoiTransactionSchema,
  JoiEmployeeSchema,
  JoiBranchSchema,
  validateAccount,
  validateUser,
};
