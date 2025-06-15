import express from "express";
import getAllMessagesByChatId from "../controllers/messages/getAllMessagesByChatId.js";
import sendMessage from "../controllers/messages/sendMessage.js";
import { validateRequest } from "../utils/validateRequest.js";
import { commonGetValidationSchema } from "../validationSchema/commonGetValidationSchema.js";
import { getAllMessagesByChatIdValidation } from "../validationSchema/getMessagesByChatIdValidation.js";
import { sendMessageValidation } from "../validationSchema/sendMessageValidation.js";

const router = express.Router();

router.post("/", sendMessageValidation, validateRequest, sendMessage);
router.get("/:chatId",commonGetValidationSchema,getAllMessagesByChatIdValidation,validateRequest,getAllMessagesByChatId) //prettier-ignore

export default router;
