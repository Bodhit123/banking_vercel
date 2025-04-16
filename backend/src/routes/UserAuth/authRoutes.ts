// routes/authRoutes.ts
import express from "express";
import { registerUser } from "../../controllers/auth/registrationController";
import { validateRequest } from "../../middlewares/reqValidator";
import { JoiUserSchema } from "../../Utils/validation";
import { loginSchema } from "../../controllers/auth/authController";
import { loginUser } from "../../controllers/auth/authController";

const router = express.Router();

router.post("/register", validateRequest(JoiUserSchema), registerUser);

router.post("/login", validateRequest(loginSchema), loginUser);

export default router;
