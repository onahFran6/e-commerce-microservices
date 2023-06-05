module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  // testMatch: ["**/test/**/*.test.(ts|js)"],
  testMatch: [
    "**/test/unit/**/*.unit.test.ts",
    "**/test/integration/**/*.integration.test.ts",
  ],
  testEnvironment: "node",
};
