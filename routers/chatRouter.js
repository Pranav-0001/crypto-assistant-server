import express from "express";
import createChat from "../controllers/chats/createChat.js";
import { createChatValidation } from "../validationSchema/createChatValidation.js";
import { commonGetValidationSchema } from "../validationSchema/commonGetValidationSchema.js";
import { getAllChatsValidation } from "../validationSchema/getAllChatsValidation.js";
import getAllChats from "../controllers/chats/getAllChats.js";
import { validateRequest } from "../utils/validateRequest.js";
import { getChatByIdValidation } from "../validationSchema/getChatByIdValidation.js";
import getChatById from "../controllers/chats/getChatById.js";

const router = express.Router();

router.post("/", createChatValidation, validateRequest, createChat);
router.get("/:sessionId", commonGetValidationSchema, getAllChatsValidation,validateRequest, getAllChats); //prettier-ignore
router.get("/chat/:chatId", getChatByIdValidation, validateRequest, getChatById);

export default router;
