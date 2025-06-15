import { openai } from "@llamaindex/openai";
import { agent } from "@llamaindex/workflow";
import { getCurrentPrice } from "./tools/getCurrentPrice.js";
import { trendingCryptos } from "./tools/trendingCryptos.js";
import { getLivePortfolioValue } from "./tools/getLivePortfolioValue.js";
import { get7DayChartData } from "./tools/get7DayChartData.js";
import { getChartData } from "./api/getChartData.js";
import saveAssistantMessage from "./saveAssistantMessage.js";
import emitEvent from "../socket/emitEvent.js";
import chatModel from "../model/chatModel.js";

export async function cryptoAdvisorAgent(message, chat) {
  const cryptoAdvisor = agent({
    name: "cryptoAdvisor",
    description:
      "A helpful AI assistant specialized in cryptocurrency trading.",
    tools: [
      getCurrentPrice,
      trendingCryptos,
      getLivePortfolioValue,
      get7DayChartData,
    ],
    llm: openai({
      model: "gpt-4o-mini",
      additionalChatOptions: {
        response_format: {
          type: "json_object",
        },
      },
    }),
    verbose: false,
    systemPrompt: `
      You are a helpful AI assistant specialized in cryptocurrency trading. 
      You can provide information about current prices, trending cryptocurrencies, portfolio values, and chart data.
      Your response should be in a JSON format with 'message' filed containing text to do text to speech and based on the tool add one more key called 'data'
      in the data field that will be a json object with {tool : <<tool name>>,data : <<data from tool>>}
      .
      `,
  });
  const response = await cryptoAdvisor.run(message);
  console.log("response:", response?.data?.result);
  const parsedMessage = JSON.parse(response?.data?.result);
  if (parsedMessage?.data?.tool === "getSymbolFor7DayChartData") {
    console.log("Getting chart data for:", parsedMessage?.data?.data);
    const data = await getChartData(
      parsedMessage?.data?.data?.symbol || parsedMessage?.data?.data
    );
    const prices = data.prices.map((price) => ({
      time: new Date(price[0]).toISOString(),
      price: price[1],
    }));
    parsedMessage.message = `Here is the 7-day chart for ${
      parsedMessage?.data?.data.symbol || parsedMessage?.data?.data
    }`;
    parsedMessage.data.prices = prices;
  }
  const savedMessage = await saveAssistantMessage(
    parsedMessage?.message,
    chat?._id,
    parsedMessage?.data
  );
  await chatModel.findOneAndUpdate(
    { _id: chat?._id },
    { lastMessage: savedMessage?.message, isGenerating: false },
    { new: true }
  );
  emitEvent({
    roomId: chat?.id,
    type: "message_received",
    payload: savedMessage,
  });
  return response.data;
}
