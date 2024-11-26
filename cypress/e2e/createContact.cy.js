//npm run test

describe('EspoCRM Demo - E2E Test', () => {
  const username = 'admin';
  const password = '1';
  const contactEmail = 'johndoe@example.com';

  beforeEach(() => {
    // Visit the EspoCRM Demo site and log in
    cy.visit('https://demo.us.espocrm.com/?l=en_US');
    cy.get('[name="username"]').type(username);
    cy.get('#btn-login').click();
  });

  it('Logs in successfully and navigates to the dashboard', () => {
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

  it('Creates a new contact and verifies it appears in the list', () => {
    // Navigate to Contacts
    cy.get('[data-name="Contact"]').first().click();
    cy.url().should('include', '#Contact');
    cy.get('[data-name="create"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-name="create"]').click();

    // Fill out the contact form
    cy.get('[data-name="firstName"]').type('John');
    cy.get('[data-name="lastName"]').type('Doe');
    cy.get('[data-name="emailAddress"]').type(contactEmail);

    // Save the contact
    cy.get('[data-name="save"]').click();

    // Verify the contact was created
    cy.get('.detail-header').should('contain.text', 'John Doe');

    // Navigate back to the contact list
    cy.get('[data-action="navigateTo"]').contains('Contacts').click();

    // Verify the new contact appears in the list
    cy.get('.list-row').should('contain.text', 'John Doe');
  });

  it('Logs out successfully', () => {
    // Log out
    cy.get('.user-profile').click();
    cy.get('[data-action="logout"]').click();

    // Verify successful logout
    cy.url().should('include', '/#Auth');
    cy.get('[name="username"]').should('be.visible');
  });
});
