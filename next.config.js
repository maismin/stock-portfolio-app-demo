const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const { parsed: localEnv } = require('dotenv').config();
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    return config;
  },
};

module.exports = withPlugins([], nextConfig);
