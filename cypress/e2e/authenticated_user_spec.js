describe('An authenticated user', () => {
  const user = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: '123456',
  };

  beforeEach(() => {
    cy.resetDb();
  });

  it('cannot sell stocks the user does not have', () => {
    cy.loginAsNewUser(user)
      .assertLoggedIn()
      .visit('/portfolio')
      .assertPortfolio();

    cy.get('input[name=ticker]')
      .type('AAPL')
      .get('input[name=shares]')
      .type('1')
      .get('[name=transactionOptions]')
      .click()
      .contains('span', 'SELL')
      .click();

    cy.get('button[type=submit]')
      .should('not.be.disabled')
      .click();

    cy.get('[data-cy=stockform-error-message]')
      .contains('stocks not owned')
      .should('exist');
  });

  it('can buy and sell stocks, and view transactions', () => {
    cy.loginAsNewUser(user)
      .assertLoggedIn()
      .visit('/portfolio')
      .assertPortfolio();

    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[name=ticker]')
      .type('AAPL')
      .get('input[name=shares]')
      .type('5')
      .get('[name=transactionOptions]')
      .click()
      .contains('span', 'BUY')
      .click();

    cy.get('button[type=submit]')
      .should('not.be.disabled')
      .click();

    cy.get('[data-cy=portfolio-list]')
      .contains('AAPL')
      .should('exist');

    cy.get('[data-cy=portfolio-list]')
      .contains('5 shares')
      .should('exist');

    cy.get('input[name=shares]')
      .clear()
      .type('3')
      .get('[name=transactionOptions]')
      .click()
      .contains('span', 'SELL')
      .click();

    cy.get('button[type=submit]').click();

    cy.get('[data-cy=portfolio-list]')
      .contains('2 shares')
      .should('exist');

    cy.visit('/transactions');

    cy.get('[data-cy=transactions-list]')
      .contains('SELL (AAPL) - 3 shares')
      .should('exist');

    cy.get('[data-cy=transactions-list]')
      .contains('BUY (AAPL) - 5 shares')
      .should('exist');
  });
});
