describe('Dashboard', () => {
  it('Visita a página inicial (dashboard)', () => {
    cy.visit('/')
    cy.get('h2').should('contain','RobDroneGo')
  })

  it('Initial project page has 6 cards', () => {
    cy.visit('/')
    cy.get('.card').should('have.length',6)

  })
})
