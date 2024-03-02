describe('Listar Piso', () => {

    beforeEach(() => {
            
        cy.intercept('POST', '/api/edificio').as('createEdificio');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('POST', '/api/piso').as('createPiso');
        cy.intercept('GET', '/api/piso?codigo=T1').as('getPisosEdificio');
        cy.intercept('DELETE', '/api/edificio?codEdificio=T1').as('apagarEdificio');
        
        cy.intercept('POST', '/api/user/login').as('login');
        cy.visit('/login');
        cy.get('[name="email"]').type('gestorcampus@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login');
        
        //Criar um edificio
        cy.visit('/criarEdificio')
        cy.get('[name="codigo"]').type('T1');
        cy.get('[name="nomeEdificio"]').type('Nome1');
        cy.get('[name="descricaoEdificio"]').type('Descricao1');
        cy.get('[name="dimensaoX"]').type('3');
        cy.get('[name="dimensaoY"]').type('3');
        cy.get('button').click();
        cy.wait('@createEdificio');


        //Criar 1 pisos
        cy.visit('/criarPiso');
        cy.wait('@getEdificio');

        cy.get('[id="codigo"]').select('T1');
        cy.get('[name="numeroPiso"]').type('1');
        cy.get('[name="descricaoPiso"]').type('Descricao1');

        cy.get('button').click();
        cy.wait('@createPiso');

    });

    it('Listar piso input load de pagina e2e', () => {
        cy.visit('/listarPiso');
        cy.wait('@getEdificio');
    
        cy.get('[id="codigo"]').find('option:first-child').should('have.text', 'Codigo Edificio*');;

    });

    it('Listar piso sucesso e2e', () => {
        cy.visit('/listarPiso');
        cy.wait('@getEdificio');
    
        cy.get('[id="codigo"]').select('T1');
        cy.wait('@getPisosEdificio')

        cy.get('p-table').contains('1');
        cy.get('p-table').contains('Descricao1'); 
    });


    afterEach(() => {
        cy.visit('/apagarEdificio');
        cy.get('[name="codigo"]').type('T1');
        cy.get('button').click();
        cy.wait('@apagarEdificio');

        cy.get('[class="logout"]').click();
    });
})