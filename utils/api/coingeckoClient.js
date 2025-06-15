import axis from "axios";

const coingeckoClient = axis.create({
  baseURL: "https://api.coingecko.com",
});

export default coingeckoClient;
