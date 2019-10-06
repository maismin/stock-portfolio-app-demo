describe('login', () => {
  const user = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: '123456',
  };

  beforeEach(() => {
    cy.resetDb();
  });

  it('should login a new user', () => {
    cy.server();
    cy.route('/api/portfolio').as('getPortfolio');

    cy.createUser(user);
    cy.visit('/login')
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
});
