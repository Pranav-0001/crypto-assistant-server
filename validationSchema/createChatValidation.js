import { body } from "express-validator";

export const createChatValidation = [
  body("sessionId").notEmpty().withMessage("Session ID is required"),
];
