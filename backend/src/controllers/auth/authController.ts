import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import Joi from "joi";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string; // Ensure JWT_SECRET is defined

// Define the structure of the login request body
interface LoginRequestBody {
  user_id: number;
  password: string;
}

// Joi validation schema for login
export const loginSchema = Joi.object<LoginRequestBody>({
  user_id: Joi.number().integer().required(),
  password: Joi.string().required(),
});

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, password } = req.body as LoginRequestBody;

    // Step 1: Find the user
    const user = await prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Step 2: Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Step 3: Generate JWT token
    const tokenPayload = {
      userId: user.user_id,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "15m",
    });

    // Step 4: Send success response with minimal user info
    res.status(200).json({
      message: "Login successful",
      user: {
        userId: user.user_id,
        fullName: user.full_name,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
