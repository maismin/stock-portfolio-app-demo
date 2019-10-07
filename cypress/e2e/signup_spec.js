describe('signup', () => {
  const user = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: '123456',
  };

  beforeEach(() => {
    cy.resetDb();
  });

  it('should register a new user', () => {
    cy.server();
    cy.route('/api/portfolio').as('getPortfolio');

    cy.visit('/')
      .findByText('Signup')
      .click()
      .get('input[name=name]')
      .type(user.name)
      .get('input[name=email]')
      .type(user.email)
      .get('input[name=password]')
      .type(user.password)
      .get('button[type=submit]')
      .click();

    cy.wait('@getPortfolio');
    cy.assertPortfolio();
    cy.assertLoggedIn();
  });

  it('fails if an existing email is used', () => {
    cy.createUser(user);
    cy.visit('/')
      .findByText('Signup')
      .click()
      .get('input[name=name]')
      .type(user.name)
      .get('input[name=email]')
      .type(user.email)
      .get('input[name=password]')
      .type(user.password)
      .get('button[type=submit]')
      .click();

    cy.get('[data-cy=signup-error-message]')
      .contains('User already exists with email')
      .should('exist');
  });
});
