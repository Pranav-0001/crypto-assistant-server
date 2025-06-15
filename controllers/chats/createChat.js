import { matchedData } from "express-validator";
import chatModel from "../../model/chatModel.js";
import { response200 } from "../../utils/successResponses.js";
import { internalServerError } from "../../utils/errorResponses.js";

export default async function createChat(req, res) {
  try {
    const { sessionId } = matchedData(req);
    const chat = await new chatModel({
      sessionId,
      lastMessage: "New chat",
    }).save();

    return response200(res, "Chat created", chat);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
}
