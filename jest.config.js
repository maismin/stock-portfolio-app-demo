module.exports = {
  testEnvironment: 'jest-environment-node',
  moduleNameMapper: {
    // '\\.module\\.css$': 'identity-obj-proxy',
    // '\\.css$': require.resolve('path_to_css_file'),
  },
  // before jest is loaded
  // setupFiles: [],
  // collectCoverageFrom: ['**/src/**/*.js'],
  /*
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      lines: 100,
      functions: 100,
    },
    // specific or globs of files that we want to maintain a certain level of coverage
    '': {
      statements: 100,
      branches: 100,
      lines: 100,
      functions: 100,
    }
  }, */
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
