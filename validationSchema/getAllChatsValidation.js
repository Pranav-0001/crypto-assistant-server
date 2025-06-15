import { param } from "express-validator";

export const getAllChatsValidation = [
  param("sessionId").isString().withMessage("sessionId is required"),
];
