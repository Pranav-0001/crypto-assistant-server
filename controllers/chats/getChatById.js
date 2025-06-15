import { matchedData } from "express-validator";
import { internalServerError } from "../../utils/errorResponses.js";
import chatModel from "../../model/chatModel.js";
import { response200 } from "../../utils/successResponses.js";
import mongoose from "mongoose";

export default async function getChatById(req, res) {
  try {
    const requestData = matchedData(req);
    const chat = await chatModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(requestData?.chatId),
        },
      },
    ]);
    return response200(res, "chat fetched successfully", chat[0] || "");
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
}
