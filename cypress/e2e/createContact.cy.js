// npm run test

describe('EspoCRM Demo - E2E Test', () => {
  const username = 'admin';

  let dynamicFirstName;
  let dynamicLastName;
  let dynamicEmail;

  beforeEach(() => {
    // Generate dynamic names and email before each test
    const timestamp = Date.now();
    dynamicFirstName = `John-${timestamp}`;
    dynamicLastName = `Doe-${timestamp}`;
    dynamicEmail = `john.doe.${timestamp}@example.com`; // Dynamic email

    // Visit the EspoCRM Demo site and log in
    cy.visit('https://demo.us.espocrm.com/');
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
    cy.intercept('GET', '/api/v1/Contact/layout/list').as('getLayoutList');

    // Navigate to Contacts
    cy.get('[data-name="Contact"]').first().click();

    // Wait for the layout API response to ensure Contacts page readiness
    cy.wait('@getLayoutList').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.be.an('array').that.is.not.empty;
    });

    cy.url().should('include', '#Contact');
    cy.get('[data-name="create"]').should('be.visible').click();
    cy.get('[data-name="firstName"]', { timeout: 30000 }).should('be.visible');

    // Fill out the contact form with dynamic names and email
    cy.get('[data-name="firstName"]').type(dynamicFirstName);
    cy.get('[data-name="lastName"]').type(dynamicLastName);
    cy.get('[data-name="emailAddress"]').type(dynamicEmail);

    // Save the contact
    cy.get('[data-name="save"]').click();

    // Verify the contact was created with dynamic details
    cy.get('[data-name="name"]').should('include.text', `${dynamicFirstName} ${dynamicLastName}`);
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
