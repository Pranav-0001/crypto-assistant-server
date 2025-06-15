import coingeckoClient from "./coingeckoClient.js";

export async function getTrendingCoins() {
  try {
    const response = await coingeckoClient.get("/api/v3/search/trending");
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
