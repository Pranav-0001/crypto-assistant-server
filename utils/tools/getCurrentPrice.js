import { tool } from "llamaindex";
import { z } from "zod";
import axios from "axios";
import { CRYPTO_SYMBOL_MAP } from "../static/cryptoSymbolMap.js";
import getCryptoPriceById from "../api/getCryptoPriceById.js";

export const getCurrentPrice = tool({
  name: "getCurrentPrice",
  description: "Get the current trading price of a cryptocurrency",
  parameters: z.object({
    crypto: z
      .string()
      .min(1, "Cryptocurrency symbol cannot be empty")
      .max(10, "Cryptocurrency symbol too long")
      .describe("The cryptocurrency symbol (e.g., ETH, BTC)"),
    currency: z
      .string()
      .min(1, "Currency code cannot be empty")
      .max(5, "Currency code too long")
      .default("USD")
      .describe("The currency to convert to (default is USD)"),
  }),
  execute: async ({ crypto, currency }) => {
    if (!crypto) {
      return "Error: Cryptocurrency symbol is required";
    }

    try {
      const upperCrypto = crypto.toUpperCase();
      const cryptoId = CRYPTO_SYMBOL_MAP[upperCrypto] || crypto.toLowerCase();
      const lowerCurrency = currency.toLowerCase();

      const data = await getCryptoPriceById(cryptoId, lowerCurrency);

      if (!data[cryptoId] || !data[cryptoId][lowerCurrency]) {
        throw new Error(`No price data available for ${crypto} in ${currency}`);
      }

      return `${crypto} is currently trading at ${currency}${data[cryptoId][lowerCurrency]}`;
    } catch (error) {
      console.error(`Error fetching price for ${crypto}:`, error);
      return `Unable to fetch price for ${crypto}: ${error.message}`;
    }
  },
});
