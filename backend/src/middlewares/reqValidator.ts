// middleware/validateRequest.ts
import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err: any) => err.message),
      });
    } else {
      next();
    }
  };
};
