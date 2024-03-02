describe('Edificio', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/edificio').as('createEdificio');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('PUT', '/api/edificio').as('editarEdificio');
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
        cy.visit('/editarEdificio')
        cy.wait('@getEdificio');
    });
    
    it('Editar edicio com sucesso', () => {
        cy.get('[name="codigo"]').select('T1');
        cy.get('[name="nomeEdificio"]').type('NomeDifrente');
        cy.get('[name="descricaoEdificio"]').type('DescricaoDiferente');
        cy.get('button').click();
        cy.wait('@editarEdificio');
        cy.get('[name="app-message"]').contains('Edificio com código: T1 editado com sucesso!');
    })

    afterEach(() => {
        cy.visit('/apagarEdificio');
        cy.get('[name="codigo"]').type('T1');
        cy.get('button').click();
        cy.wait('@apagarEdificio');

        cy.get('[class="logout"]').click();
    });
})
