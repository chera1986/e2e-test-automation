
import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
    // Return false to prevent Cypress from failing the test
    if (err.message.includes('isConnected')) {
      return false;
    }
    return true;
  });
  