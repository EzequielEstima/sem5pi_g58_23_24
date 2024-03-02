describe('Listar Edificio com Minimo e Max Pisos', () => {

    beforeEach(() => {
            
        cy.intercept('POST', '/api/edificio').as('createEdificio');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('POST', '/api/piso').as('createPiso');
        cy.intercept('GET', 'api/edificio/listarMinEMaxPisos?minPisos=0&maxPisos=2').as('getEdificioMinMax');
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
        cy.get('[name="dimensaoY"]').type('4');
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

    it('Listar Edificio Min e Max pisos input load de pagina', () => {
        cy.visit('/listarEdificioMinMaxPisos');

        cy.get('[name="minPiso"]').should('have.attr', 'placeholder', 'Numero mínimo pisos*');
        cy.get('[name="maxPiso"]').should('have.attr', 'placeholder','Numero máximo pisos*');
        
    });

    it('Listar Edificio Min e Max com dados invalidos falha e2e', () => {
        cy.visit('/listarEdificioMinMaxPisos');

        cy.get('[name="minPiso"]').type('1');
        cy.get('[name="maxPiso"]').type('0');

        cy.get('button').click();

        cy.get('[name="app-message"]').contains("Listar Edificio com Min e Max Pisos falhou: O número mínimo de pisos não pode ser superior ao máximo");
        
    })

    it('Listar Edificio Min e Max pisos sucesso e2e', () => {
        cy.visit('/listarEdificioMinMaxPisos');
    
        cy.get('[name="minPiso"]').type('0');
        cy.get('[name="maxPiso"]').type('1');

        cy.get('button').click();
        
        cy.get('p-table').contains('T1');
        cy.get('p-table').contains('Nome1');
        cy.get('p-table').contains('Descricao1'); 
        cy.get('p-table').contains('3'); 
        cy.get('p-table').contains('4'); 
    })


    afterEach(() => {
        cy.visit('/apagarEdificio');
        cy.get('[name="codigo"]').type('T1');
        cy.get('button').click();
        cy.wait('@apagarEdificio');

        cy.get('[class="logout"]').click();
    });
})