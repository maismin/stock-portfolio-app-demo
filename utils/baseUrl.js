const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://stock-portfolio-ttp-demo.herokuapp.com'
    : 'http://localhost:3000';

export default baseUrl;
