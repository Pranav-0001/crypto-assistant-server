import { tool } from "llamaindex";
import { z } from "zod";
import axios from "axios";
import { getTrendingCoins } from "../api/getTrendingCoins.js";
import getCoinsDataByIds from "../api/getCoinsDataByIds.js";

export const trendingCryptos = tool({
  name: "trendingCryptos",
  description: "Get the top trending cryptocurrencies and show basic stats.",
  parameters: z.object({
    limit: z
      .number()
      .int("Limit must be an integer")
      .min(1, "Limit must be at least 1")
      .max(25, "Limit cannot exceed 25")
      .default(5)
      .describe("The number of top trending cryptocurrencies to return"),
  }),
  execute: async ({ limit }) => {
    try {
      const trendingData = await getTrendingCoins();

      if (!trendingData.coins || !trendingData.coins.length) {
        return "No trending cryptocurrencies found";
      }

      const trendingCoins = trendingData.coins
        .slice(0, limit)
        .map((coin) => coin.item.id);

      const coinsData = await getCoinsDataByIds(trendingCoins, limit);

      if (!coinsData.length) {
        return "No detailed data available for trending cryptocurrencies";
      }

      const formattedCoins = coinsData
        .map((coin) => {
          const marketCap = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
          }).format(coin.market_cap);

          return `\n- ${
            coin.name
          } (${coin.symbol.toUpperCase()}):\n  • Market Cap: ${marketCap}\n  • Price: $${
            coin.current_price
          }\n  • 24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%`;
        })
        .join("");

      return `Top ${limit} Trending Cryptocurrencies:${formattedCoins}`;
    } catch (error) {
      console.error("Error fetching trending cryptocurrencies:", error);
      return `Unable to fetch trending cryptocurrencies: ${error.message}`;
    }
  },
});
