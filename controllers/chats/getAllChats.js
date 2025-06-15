import { matchedData } from "express-validator";
import chatModel from "../../model/chatModel.js";
import paginatior from "../../utils/paginator.js";
import { response200 } from "../../utils/successResponses.js";

export default async function getAllChats(req, res) {
  try {
    const requestData = matchedData(req);
    const { page, limit, skip } = paginatior(requestData);
    const [result] = await chatModel.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: { createdAt: -1 } },
            ...(page && limit ? [{ $skip: skip }, { $limit: limit }] : []),
          ],
        },
      },
    ]);
    const totalCount = result?.metadata?.[0]?.total || 0;
    const response = {
      chats: result?.data,
      page: Number(page),
      limit,
      totalPageCount: Math.ceil(totalCount / limit),
      totalCount,
    };
    return response200(res, "Chats retrieved", response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
}
