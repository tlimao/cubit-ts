module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/cubit/__tests__'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverageFrom: [
    'cubit/src/**/*.ts',
    '!cubit/src/index.ts'
  ],
  coverageReporters: ['text', 'lcov', 'json', 'json-summary', 'html'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
