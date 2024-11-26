describe('EspoCRM Create Account Demo - E2E Test', () => {
    const username = 'admin';
  
    let dynamicName;
    let dynamicEmail;
  
    beforeEach(() => {
      // Generate dynamic name and email before each test
      const timestamp = Date.now();
      dynamicName = `Jane-Brown-${timestamp}`;
      dynamicEmail = `jane.brown.${timestamp}@example.com`;
  
      // Visit the EspoCRM Demo site and log in using a custom command
      cy.loginToEspoCRM(username);
    });
  
    it('Logs in successfully, creates an account, and verifies it appears in the list', () => {
      // Intercept API call for Accounts layout
      cy.intercept('GET', '/api/v1/Account/layout/list').as('getLayoutList');
  
      // Navigate to the Accounts page
      cy.get('[data-name="Account"]').first().click();
  
      // Wait for the API response to ensure Accounts page readiness
      cy.wait('@getLayoutList').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.be.an('array').that.is.not.empty;
      });
  
      // Verify URL includes "#Account"
      cy.url().should('include', '#Account');
  
      // Click the "Create" button
      cy.get('[data-name="create"]').should('be.visible').click();
  
      // Fill out the Account form with dynamic data
      cy.get('[data-name="name"]', { timeout: 30000 }).should('be.visible').type(dynamicName);
      cy.get('[data-name="emailAddress"]').type(dynamicEmail);
  
      // Save the Account
      cy.get('[data-name="save"]').click();
  
      // Verify the Account was created with the correct name
      cy.get('[data-name="name"]').should('include.text', dynamicName);
    });
  });
  