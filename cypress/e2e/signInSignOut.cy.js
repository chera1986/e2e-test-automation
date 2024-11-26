describe('EspoCRM Sign in and Out Demo', () => {
    const username = 'admin';


    beforeEach(() => {
        // Visit the EspoCRM Demo site and log in
        cy.loginToEspoCRM(username)
      });
    

    it('Logs in successfully', () => {
        // Verify successful login
        cy.get('.home-content').should('be.visible');
        cy.get('.label-text').should('include.text', 'CRM');
    
        // List of selectors to verify
        const dataNames = [
          'Account',
          'Contact',
          'Lead',
          'Opportunity',
          'Email',
          'Calendar',
          'Meeting',
          'Call',
          'Task',
        ];
    
        // Iterate through each selector and verify visibility
        dataNames.forEach((name) => {
          cy.get(`[data-name="${name}"]`).should('be.visible');
        });
      });

      it('Logs out successfully', () => {
        // Log out by clicking the dropdown in the navigation bar
        cy.get('.navbar-nav')
          .find('[data-toggle="dropdown"]')
          .last()
          .click();
    
        // Click on the logout option
        cy.get('[data-name="logout"]').click();
    
        // Verify successful logout
        cy.url().should('eq', 'https://demo.us.espocrm.com/?l=en_US');
      });
    });
    
   