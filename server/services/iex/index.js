const axios = require('axios');

/**
 * Retrieves the opening and latest prices of tickers
 *
 * @param {string[]} tickers
 */
const getStockQuotes = async tickers => {
  const token = process.env.IEX_KEY;
  const baseUri = process.env.IEX_URI;
  const uri = `${baseUri}/stock/market/batch`;
  // console.log('EXTERNAL API CALL: ', uri);
  const params = { symbols: tickers.join(','), types: 'previous,price', token };
  const payload = { params };
  const response = await axios.get(uri, payload);
  return response;
};

/**
 * Retrieves the latest price of the ticker
 *
 * @param {string} ticker
 */
const getStockPrice = async ticker => {
  const token = process.env.IEX_KEY;
  const baseUri = process.env.IEX_URI;
  const uri = `${baseUri}/stock/${ticker}/price`;
  const params = { token };
  const payload = { params };
  const response = await axios.get(uri, payload);
  return response;
};

module.exports = {
  getStockQuotes,
  getStockPrice,
};
