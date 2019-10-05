// jest sets NODE_ENV to test by default
const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          // modules are transpiled to commonjs for jest
          modules: isTest ? 'commonjs' : false,
        },
        'transform-runtime': {},
        'styled-jsx': {},
        'class-properties': {},
      },
    ],
  ],
  // plugins: [],
};
