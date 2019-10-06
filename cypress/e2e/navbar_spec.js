describe('The site', () => {
  it('redirects to /login when the Portfolio or Transactions menu is clicked', () => {
    cy.visit('/')
      .findByText('Portfolio')
      .click();
    cy.url().should('include', '/login');

    cy.findByText('Transactions').click();
    cy.url().should('include', '/login');
  });
});
