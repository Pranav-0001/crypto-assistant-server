import { tool } from "llamaindex";
import { z } from "zod";
import { CRYPTO_SYMBOL_MAP } from "../static/cryptoSymbolMap.js";

export const get7DayChartData = tool({
  name: "getSymbolFor7DayChartData",
  description:
    "Get the symbol for fetching 7-day chart data of a cryptocurrency.",
  parameters: z.object({
    crypto: z
      .string()
      .min(1, "Cryptocurrency symbol cannot be empty")
      .max(10, "Cryptocurrency symbol too long")
      .describe("The cryptocurrency symbol (e.g., ETH, BTC)"),
  }),
  execute: async ({ crypto }) => {
    if (!crypto) {
      return "Error: Cryptocurrency symbol is required";
    }

    try {
      const upperCrypto = crypto.toUpperCase();
      const cryptoId = CRYPTO_SYMBOL_MAP[upperCrypto] || crypto.toLowerCase();
      
      return `symbol to fetch 7-day chart data is ${cryptoId}`;
    } catch (error) {
      console.error(`Error processing crypto symbol ${crypto}:`, error);
      return `Unable to fetch 7-day chart data for ${crypto}: ${error.message}`;
    }
  },
});
