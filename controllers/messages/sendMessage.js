import { matchedData } from "express-validator";
import { getChartData } from "../../utils/api/getChartData.js";
import { cryptoAdvisorAgent } from "../../utils/cryptoInsightAgent.js";
import messageModel from "../../model/messageModel.js";
import chatModel from "../../model/chatModel.js";
import { response200 } from "../../utils/successResponses.js";
import { internalServerError } from "../../utils/errorResponses.js";

export default async function sendMessage(req, res) {
  try {
    const requestData = matchedData(req);

    let chat;
    if (!requestData?.chatId) {
      chat = await new chatModel({
        sessionId: requestData?.sessionId,
        lastMessage: requestData?.message,
      }).save();
    } else {
      chat = await chatModel.findOneAndUpdate(
        { _id: requestData?.chatId },
        { lastMessage: requestData?.message },
        { new: true }
      );
    }
    const message = await new messageModel({
      chat: chat?._id,
      message: requestData?.message,
      sender: "user",
    }).save();
    cryptoAdvisorAgent(requestData?.message, chat);
    chat.isGenerating = true;
    await chat.save();
    return response200(res, "Message sent", {
      message,
      chat,
    });
  } catch (err) {
    console.error("Error in sendMessage:", err);
    return internalServerError(res);
  }
}
