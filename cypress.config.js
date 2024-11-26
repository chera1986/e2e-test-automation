const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://demo.us.espocrm.com/?l=en_US',
    defaultCommandTimeout: 15000, // 15 seconds
    pageLoadTimeout: 60000,      // 60 seconds
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    watchForFileChanges: false
  },
});
