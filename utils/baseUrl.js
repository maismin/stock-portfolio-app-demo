const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'productionURL'
    : 'http://localhost:3000';

export default baseUrl;
