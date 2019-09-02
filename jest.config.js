module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  preset: 'ts-jest',
  testEnvironment: "node",
  testMatch: [
    "**/test/**/*.test.ts",
  ],
  collectCoverageFrom: [
    "src/**"
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};