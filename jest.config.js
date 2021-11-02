module.exports = {
  // u can change this option to a more specific folder for test single component or util when dev
  // for example, ['<rootDir>/packages/components/button']
  roots: ['<rootDir>/src/'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.(t|j)sx?$': [
      'babel-jest',
      {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: true,
              },
            },
          ],
          [
            'babel-preset-vite',
            {
              env: true, // defaults to true
              glob: false, // defaults to true
            },
          ],
          [
            '@vue/babel-preset-jsx',
            {
              compositionAPI: true,
              injectH: true,
            },
          ],

          '@babel/preset-typescript',
        ],
        plugins: [
          // 'transform-vue-jsx',
          // ["@babel/plugin-proposal-decorators", { "legacy": true }]
        ],
      },
    ],
  },
  globals: {
    __DEV__: true,
  },
  moduleNameMapper: {
    '^@tests': '<rootDir>/tests',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'cobertura'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/tests',
    '<rootDir>/src/table/common/utils.ts',  // 动态打日志的函数
  ],
  reporters: ['default', 'jest-junit'],
};
