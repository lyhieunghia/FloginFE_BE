const { defineConfig } = require("cypress");
const codeCoverage = require("@cypress/code-coverage/plugin");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverage(on, config);
      return config;
    },
    baseUrl: "http://localhost:3000",
    defaultCommandTimeout: 10000,
    viewportWidth: 1366,
    viewportHeight: 768,
    video: false
  },
});
