import { param } from "express-validator";

export const getAllMessagesByChatIdValidation = [
  param("chatId").isMongoId().withMessage("Invalid chat id"),
];
