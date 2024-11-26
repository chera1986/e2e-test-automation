
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//



   // Visit the EspoCRM Demo site and log in
   Cypress.Commands.add('loginToEspoCRM', (username) => {
    // Visit the EspoCRM Demo site and log in
    cy.visit('https://demo.us.espocrm.com/');
    cy.get('[name="username"]').type(username);
    cy.get('#btn-login').click();
  });
  