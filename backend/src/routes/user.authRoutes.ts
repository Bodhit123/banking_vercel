// routes/authRoutes.ts
import express from "express";
import { registerUser } from "../controllers/auth/registrationController";
import { validateRequest } from "../middlewares/reqValidator";
import { JoiUserSchema } from "../Utils/validation";

const router = express.Router();

router.post("/register", validateRequest(JoiUserSchema), registerUser);

export default router;
