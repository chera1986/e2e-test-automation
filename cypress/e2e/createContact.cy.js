// npm run test

describe('EspoCRM Create Contact Demo', () => {
  const username = 'admin';

  let dynamicFirstName;
  let dynamicLastName;
  let dynamicEmail;

   // Generate dynamic names and email
   const timestamp = Date.now();
   dynamicFirstName = `John-${timestamp}`;
   dynamicLastName = `Doe-${timestamp}`;
   dynamicEmail = `john.doe.${timestamp}@example.com`; // Dynamic email

  beforeEach(() => {
    // Visit the EspoCRM Demo site and log in
    cy.loginToEspoCRM(username)
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
    cy.get('[data-name="emailAddress"]').first().type(dynamicEmail);

    // Save the contact
    cy.get('[data-name="save"]').click();

    // Verify the contact was created with dynamic details
    cy.get('[data-name="name"]').should('include.text', `${dynamicFirstName} ${dynamicLastName}`);
  });
});