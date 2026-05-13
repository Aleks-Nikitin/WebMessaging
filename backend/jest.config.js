

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['babel-jest', {configFile: './babel.config.js'}],
  },
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'json', 'node'],
};

export default config;
