const axios = require('axios');

/**
 * Retrieves the stock quote from Alphavantage API
 *
 * @param {String} ticker
 * @return {Object}
 */
const getStockQuote = async ticker => {
  const vantageURI = process.env.ALPHA_VANTAGE_URI;
  const vantageKEY = process.env.ALPHA_VANTAGE_KEY;
  const functionValue = 'GLOBAL_QUOTE';
  const params = {
    function: functionValue,
    symbol: ticker,
    apikey: vantageKEY,
  };
  const payload = { params };
  const response = await axios.get(vantageURI, payload);
  return response.data;
};

module.exports = {
  getStockQuote,
};
