// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
/* eslint import/no-extraneous-dependencies: 0 */
// import Cypress from '@testing-library/cypress';
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('resetDb', () => {
  cy.request({
    url: `${Cypress.config().baseUrl}/api/testing/reset`,
    method: 'POST',
  });
});

Cypress.Commands.add('createUser', user => {
  cy.request({
    url: `${Cypress.config().baseUrl}/api/signup`,
    method: 'POST',
    body: user,
  });
});

Cypress.Commands.add('login', credentials => {
  cy.request({
    url: `${Cypress.config().baseUrl}/api/login`,
    method: 'POST',
    body: credentials,
  }).then(({ body }) => cy.setCookie('token', body.token));
});

Cypress.Commands.add('loginAsNewUser', user => {
  cy.createUser(user).then(() => {
    const { email, password } = user;
    cy.login({ email, password });
  });
});

Cypress.Commands.add('assertPortfolio', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/portfolio`);
});

Cypress.Commands.add('assertLoggedIn', () => {
  cy.getCookie('token')
    .should('exist')
    .should('have.property', 'name', 'token');
});
