module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/js/**/*.{js,mjs}",
    "!src/js/**/*.test.js",
    "!src/test/**"
  ],
  coverageDirectory: "coverage",
  testMatch: [
    "**/src/test/**/*.test.js"
  ],
  transform: {
    "^.+\\.(js|mjs)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules"
  ],
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  moduleFileExtensions: ["js", "mjs"],
  verbose: false
};
