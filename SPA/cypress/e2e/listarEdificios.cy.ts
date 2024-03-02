describe('Edificio', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/edificio').as('createEdificio');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('DELETE', '/api/edificio?codEdificio=T1').as('apagarEdificio');

        cy.intercept('POST', '/api/user/login').as('login');
        cy.visit('/login');
        cy.get('[name="email"]').type('gestorcampus@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login');
        
        cy.visit('/criarEdificio')
        cy.get('[name="codigo"]').type('T1');
        cy.get('[name="nomeEdificio"]').type('Nome1');
        cy.get('[name="descricaoEdificio"]').type('Descricao1');
        cy.get('[name="dimensaoX"]').type('3');
        cy.get('[name="dimensaoY"]').type('3');
        cy.get('button').click();
        cy.wait('@createEdificio');
    });
    
    it('Listar edificios com sucesso', () => {
        cy.visit('/listarEdificios')
        cy.wait('@getEdificio');
        cy.get('p-table tbody tr').contains('td', 'T1').parent('tr').within(() => {
            cy.get('td').eq(1).should('contain.text', 'Nome1');
            cy.get('td').eq(2).should('contain.text', 'Descricao1');
            cy.get('td').eq(3).should('contain.text', '3');
            cy.get('td').eq(4).should('contain.text', '3');
        });
    })

    afterEach(() => {
        cy.visit('/apagarEdificio');
        cy.get('[name="codigo"]').type('T1');
        cy.get('button').click();
        cy.wait('@apagarEdificio');
        
        cy.get('[class="logout"]').click();

    });
})
