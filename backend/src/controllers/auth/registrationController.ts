// controllers/auth/register.ts
// Your registration logic is mainly about auth onboarding, not account data creation.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
const prisma = new PrismaClient();

interface RegisterUserRequestBody {
  accountNumber: string;
  user_id?: number; // Optional
  branchCode?: string; // Optional
  country?: string; // Optional
  mobileNumber: string;
  email: string;
  fullName: string;
  password: string;
}

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      accountNumber,
      user_id,
      branchCode,
      country,
      mobileNumber,
      email,
      fullName,
      password,
    } = req.body as RegisterUserRequestBody;

    // 1. Validate existing Account and CIF
    const account = await prisma.account.findUnique({
      where: { account_number: accountNumber },
      include: { user: true },
    });

    if (!account || account.user_id !== (user_id || "0")) {
      res.status(400).json({ error: "Invalid Account Number or CIF Number" });
      return;
    }

    // ✅ Check account status too
    if (account.status !== "active") {
      res.status(400).json({
        error: `Account is not active. Current status: ${account.status}`,
      });
      return;
    }

    // 2. Check if user already has login credentials
    const existingUser = await prisma.user.findUnique({
      where: { user_id: account.user_id },
    });

    if (existingUser?.password_hash) {
      res.status(400).json({ error: "User already registered" });
      return;
    }

    // 3. Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Update User record with login info
    const updatedUser = await prisma.user.update({
      where: { user_id: account.user_id },
      data: {
        full_name: fullName,
        email,
        password_hash: passwordHash,
        phone_number: mobileNumber,
        role: "user",
      },
    });

    res.status(201).json({
      message:
        "Registration successful. You can now login using SBI Online or YONO.",
      userId: updatedUser.user_id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error); // Pass the error to the Express error handler
  }
};
