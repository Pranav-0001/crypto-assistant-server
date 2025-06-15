import { param } from "express-validator";

export const getChatByIdValidation = [
  param("chatId").isMongoId().withMessage("Invalid chatId"),
];
