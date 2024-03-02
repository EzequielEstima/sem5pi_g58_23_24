describe('Listar passagens por par de edifícios', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/edificio').as('createEdificio');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('POST', '/api/piso').as('createPiso');
        cy.intercept('POST', '/api/passagem').as('createPassagem');
        cy.intercept('GET', '/api//passagem/listarPassagensPorParDeEdificios?edificioACod=T1&edificioBCod=T2').as('getPassagensPorEdificio');
        cy.intercept('DELETE', '/api/edificio?codEdificio=T1').as('apagarEdificio');
        
        cy.intercept('POST', '/api/user/login').as('login');
        cy.visit('/login');
        cy.get('[name="email"]').type('gestorcampus@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login');
        
        //Criar 2 edificio
        cy.visit('/criarEdificio')
        cy.get('[name="codigo"]').type('T1');
        cy.get('[name="nomeEdificio"]').type('Nome1');
        cy.get('[name="descricaoEdificio"]').type('Descricao1');
        cy.get('[name="dimensaoX"]').type('3');
        cy.get('[name="dimensaoY"]').type('3');
        cy.get('button').click({ multiple: true });
        cy.wait('@createEdificio');

        cy.get('[name="codigo"]').clear().type('T2');
        cy.get('button').click({ multiple: true });
        cy.wait('@createEdificio');
        
        //Criar 2 pisos
        cy.visit('/criarPiso');
        cy.wait('@getEdificio');

        cy.get('[id="codigo"]').select('T1');
        cy.get('[name="numeroPiso"]').type('1');
        cy.get('[name="descricaoPiso"]').type('Descricao1');

        cy.get('button').click({ multiple: true });
        cy.wait('@createPiso');
       
        cy.get('[id="codigo"]').select('T2');
       
       
        cy.get('[name="numeroPiso"]').clear().type('1');

        cy.get('button').click({ multiple: true });
        cy.wait('@createPiso');

        //Criar passagem


        cy.visit('/criarPassagem');
        cy.wait('@getEdificio');

        cy.get('[name="codigoEdificioA"]').select('T1');
        cy.get('[name="codigoEdificioB"]').select('T2');
        cy.get('[name="numeroPisoA"]').type('1');
        cy.get('[name="numeroPisoB"]').type('1');
        cy.get('[name="id"]').type('999999');

        cy.get('button').click();
        cy.wait('@createPassagem');        


    });
    
    it('Listar passagens por edifícios sucesso e2e', () => {
        cy.visit('/listarPassagensPorEdificio');
        cy.wait('@getEdificio');

        
        cy.get('[id="cod1"]').select('T1');
        cy.get('[id="cod2"]').select('T2');

        cy.get('button').click();
        cy.wait('@getPassagensPorEdificio').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(200);
        });

        cy.get('p-table').contains('999999');
    })

    afterEach(() => {
        cy.visit('/apagarEdificio');
        cy.get('[name="codigo"]').type('T1');
        cy.get('button').click();
        cy.get('[name="codigo"]').clear();
        cy.get('[name="codigo"]').type('T2');
        cy.get('button').click();
        cy.wait('@apagarEdificio');

        cy.get('[class="logout"]').click();
    });
})
