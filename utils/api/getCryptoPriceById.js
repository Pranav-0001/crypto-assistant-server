import coingeckoClient from "./coingeckoClient.js";

export default async function getCryptoPriceById(cryptoId, currency) {
  try {
    const resonse = await coingeckoClient(
      `/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${currency.toLowerCase()}`
    );
    return resonse?.data;
  } catch (err) {
    console.log(err?.message);
    if (err?.response?.status === 429) {
      console.log("Too many requests");
      return "Too many requests rate limit exceeded please try again later";
    }
    return err?.message;
  }
}
