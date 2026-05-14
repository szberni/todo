/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  verbose: true,
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1"
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  collectCoverage: true,
  collectCoverageFrom: ["./src/**"],
  coverageReporters: ["html"],
  coverageDirectory: "./coverage",
};
