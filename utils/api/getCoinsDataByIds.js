import coingeckoClient from "./coingeckoClient.js";

export default async function getCoinsDataByIds(ids, limit) {
  try {
    const response = await coingeckoClient(
      `/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(
        ","
      )}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
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
