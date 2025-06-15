import coingeckoClient from "./coingeckoClient.js";

export async function getChartData(symbol) {
  try {
    const response = await coingeckoClient.get(
      `/api/v3/coins/${symbol?.toLowerCase()}/market_chart?vs_currency=usd&days=7`
    );
    return response?.data;
  } catch (err) {
    console.log(err?.message);
    if (err?.response?.status === 429) {
      console.log("Too many requests");
      return "Too many requests rate limit exceeded please try again later";
    }
    return err?.message;
  }
}
