import { matchedData } from "express-validator";
import messageModel from "../../model/messageModel.js";
import paginatior from "../../utils/paginator.js";
import { internalServerError } from "../../utils/errorResponses.js";
import { response200 } from "../../utils/successResponses.js";
import mongoose from "mongoose";
export default async function getAllMessagesByChatId(req, res) {
  try {
    const requestData = matchedData(req);
    const { page, limit, skip } = paginatior(requestData);
    const [result] = await messageModel.aggregate([
      {
        $match: {
          chat: new mongoose.Types.ObjectId(requestData?.chatId),
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            ...(page && limit ? [{ $skip: skip }, { $limit: limit }] : []),
          ],
        },
      },
    ]);
    const totalCount = result?.metadata?.[0]?.total || 0;
    const response = {
      messages: result?.data,
      page: Number(page),
      limit,
      totalPageCount: Math.ceil(totalCount / limit),
      totalCount,
    };
    return response200(res, "Messages retrieved", response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
}
