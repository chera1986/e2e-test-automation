describe('EspoCRM Create Lead Demo - E2E Test', () => {
    const username = 'admin';
    let dynamicFirstName;
    let dynamicLastName;
    let dynamicEmail;
  
    beforeEach(() => {
      // Generate dynamic name and email before each test
      const timestamp = Date.now();
      dynamicFirstName = `Karen-${timestamp}`;
      dynamicLastName = `Smith-${timestamp}`;
      dynamicEmail = `karen.smith.${timestamp}@example.com`;
  
      // Visit the EspoCRM Demo site and log in using a custom command
      cy.loginToEspoCRM(username);
    });
  
    it('Logs in successfully, creates a lead, and verifies it appears in the list', () => {
      // Intercept API call for Leads layout
      cy.intercept('GET', '/api/v1/Lead/layout/list').as('getLayoutList');
  
      // Navigate to the Leads page and wait for API response
      cy.get('[data-name="Lead"]').first().click();
      cy.wait('@getLayoutList').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.be.an('array').that.is.not.empty;
      });
  
      // Verify navigation to the Leads page
      cy.url().should('include', '#Lead');
  
      // Click the "Create" button
      cy.get('[data-name="create"]').should('be.visible').click();
  
      // Fill out the Lead form with dynamic data
      cy.get('[data-name="name"]', { timeout: 30000 }).should('be.visible').type(dynamicFirstName);
      cy.get('[data-name="emailAddress"]').type(dynamicEmail);
  
      // Intercept API call for saving the Lead and save the contact
      cy.intercept('POST', '/api/v1/Lead').as('postLead');
      cy.get('[data-name="save"]').click();
      cy.wait('@postLead').its('response.statusCode').should('eq', 200);
  
      // Verify the lead was created with dynamic details
      cy.get('[data-name="name"]').should('include.text', dynamicFirstName);
    });
  });
  