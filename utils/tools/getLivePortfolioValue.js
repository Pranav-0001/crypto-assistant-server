import { tool } from "llamaindex";
import { z } from "zod";
import axios from "axios";
import { CRYPTO_SYMBOL_MAP } from "../static/cryptoSymbolMap.js";
import getCryptoPriceById from "../api/getCryptoPriceById.js";

export const getLivePortfolioValue = tool({
  name: "getLivePortfolioValue",
  description:
    "Get the live value of a cryptocurrency portfolio based on current prices.",
  parameters: z.object({
    portfolio: z
      .array(
        z.object({
          crypto: z
            .string()
            .min(1, "Cryptocurrency symbol cannot be empty")
            .max(10, "Cryptocurrency symbol too long")
            .describe("The cryptocurrency symbol (e.g., ETH, BTC)"),
          amount: z
            .number()
            .positive("Amount must be positive")
            .describe("The amount of the cryptocurrency"),
        })
      )
      .min(1, "Portfolio must contain at least one cryptocurrency"),
    currency: z
      .string()
      .min(1, "Currency code cannot be empty")
      .max(5, "Currency code too long")
      .default("USD")
      .describe("The currency to convert to (default is USD)"),
  }),
  execute: async ({ portfolio, currency }) => {
    try {
      console.log({ portfolio });
      const lowerCurrency = currency.toLowerCase();
      const portfolioValues = await Promise.all(
        portfolio.map(async (item) => {
          const upperCrypto = item.crypto.toUpperCase();
          const cryptoId =
            CRYPTO_SYMBOL_MAP[upperCrypto] || item.crypto.toLowerCase();

          const data = await getCryptoPriceById(cryptoId, lowerCurrency);

          if (!data[cryptoId] || !data[cryptoId][lowerCurrency]) {
            throw new Error(`No price data available for ${item.crypto}`);
          }

          const price = data[cryptoId][lowerCurrency];
          return {
            crypto: item.crypto,
            amount: item.amount,
            value: item.amount * price,
          };
        })
      );

      const totalValue = portfolioValues.reduce(
        (acc, item) => acc + item.value,
        0
      );
      const breakdown = portfolioValues
        .map(
          (item) =>
            `\n- ${item.crypto}: ${
              item.amount
            } (${currency}${item.value.toFixed(2)})`
        )
        .join("");

      return `Portfolio Value: ${currency}${totalValue.toFixed(
        2
      )}\nBreakdown:${breakdown}`;
    } catch (error) {
      console.error("Portfolio value calculation error:", error);
      return `Unable to fetch portfolio value: ${error.message}`;
    }
  },
});
