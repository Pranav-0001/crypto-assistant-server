import { body } from "express-validator";

export const sendMessageValidation = [
  body("message").notEmpty().withMessage("Message cannot be empty"),
  body("chatId")
    .optional({ values: "falsy" })
    .isMongoId()
    .withMessage("ChatId must be a valid mongo id"),
  body("sessionId").notEmpty().withMessage("SessionId cannot be empty"),
];
