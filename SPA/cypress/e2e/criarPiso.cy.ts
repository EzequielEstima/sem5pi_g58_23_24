describe('Criar piso', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/edificio').as('createEdificio');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('POST', '/api/piso').as('createPiso');
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


    });

    it('Criar piso input load de pagina', () => {
        cy.visit('/criarPiso');
        cy.wait('@getEdificio');

        cy.get('#codigo').find('option:first-child').should('have.text', 'Codigo Edificio *')        
        cy.get('[name="numeroPiso"]').should('have.attr', 'placeholder', 'Numero do Piso *');
        cy.get('[name="descricaoPiso"]').should('have.attr', 'placeholder','Descrição do Piso');


    });

    it('Criar piso falha sem codigo e numero selecionado selecionado', () => {
        cy.visit('/criarPiso');
        cy.wait('@getEdificio');

        cy.get('button').click();

        cy.get('[name="app-message"]').contains("ERRO: Código deve ser preenchido.");
        cy.get('[name="app-message"]').contains("ERRO: Número do Piso deve ser preenchido.");
 
    });
    
    it('Criar piso sucesso e2e', () => {
        cy.visit('/criarPiso');
        cy.wait('@getEdificio');

        cy.get('[id="codigo"]').select('T1');
        cy.get('[name="numeroPiso"]').type('1');
        cy.get('[name="descricaoPiso"]').type('Descricao1');

        cy.get('button').click();
        cy.wait('@createPiso').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(201); // Adjust the status code as needed
        });;

        
        cy.get('[name="app-message"]').contains('Piso com código: T1, número Piso: 1, descrição: Descricao1 criado com sucesso!');

    })

    it('Criar piso falha se ja existir', () => {
        cy.visit('/criarPiso');
        cy.wait('@getEdificio');

        cy.get('[id="codigo"]').select('T1');
        cy.get('[name="numeroPiso"]').type('1');
        cy.get('[name="descricaoPiso"]').type('Descricao1');

        cy.get('button').click({ multiple: true });
        cy.wait('@createPiso').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(201); // Adjust the status code as needed
        });;

        cy.get('button').click({ multiple: true });
        cy.wait('@createPiso').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(400); // Adjust the status code as needed
        });;

        
        cy.get('[name="app-message"]').contains('Criar Piso falhou: O piso numero 1 já existe');


    });

    afterEach(() => {
        cy.visit('/apagarEdificio');
        cy.get('[name="codigo"]').type('T1');
        cy.get('button').click();
        cy.wait('@apagarEdificio');
        
        cy.get('[class="logout"]').click();

    });
})
