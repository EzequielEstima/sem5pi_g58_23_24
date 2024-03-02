describe('Editar passagem', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/edificio').as('createEdificio');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('POST', '/api/piso').as('createPiso');
        cy.intercept('GET', '/api/piso?codigo=T1').as('getPisosEdificioA');
        cy.intercept('GET', '/api/piso?codigo=T2').as('getPisosEdificioB');
        cy.intercept('POST', '/api/passagem').as('createPassagem');
        cy.intercept('PUT', '/api/passagem').as('editPassagem');
        cy.intercept('DELETE', '/api/edificio?codEdificio=T1').as('apagarEdificio');

        cy.intercept('POST', '/api/user/login').as('login');
        cy.visit('/login');
        cy.get('[name="email"]').type('gestorcampus@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login');
        //Criar 2 edificios
       
        cy.visit('/criarEdificio')
        cy.get('[name="codigo"]').type('T1');
        cy.get('[name="nomeEdificio"]').type('Nome1');
        cy.get('[name="descricaoEdificio"]').type('Descricao1');
        cy.get('[name="dimensaoX"]').type('3');
        cy.get('[name="dimensaoY"]').type('3');
        cy.get('button').click({ multiple: true });
        cy.wait('@createEdificio');

        cy.get('[name="codigo"]').clear().type('T2');
        cy.get('[name="nomeEdificio"]').clear().type('Nome2');
        cy.get('[name="descricaoEdificio"]').clear().type('Descricao2');
        cy.get('[name="dimensaoX"]').clear().type('3');
        cy.get('[name="dimensaoY"]').clear().type('3');
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

    it('Editar passagem input load de pagina', () => {
        cy.visit('/editarPassagem');
        cy.wait('@getEdificio');

        cy.get('[name="codigoEdificioA"]').find('option:first-child').should('have.text', 'Codigo Edificio *')
        cy.get('[name="codigoEdificioB"]').find('option:first-child').should('have.text', 'Codigo Edificio *')
        cy.get('[name="numeroPisoA"]').find('option:first-child').should('have.text', 'Numero de Piso do Edificio A *')
        cy.get('[name="numeroPisoB"]').find('option:first-child').should('have.text', 'Numero de Piso do Edificio B *')
        cy.get('[name="id"]').should('have.attr', 'placeholder', 'ID da Passagem *');
     
    });

    it('Editar passagem falha sem codigo e numero piso', () => {
       
        cy.visit('/criarPassagem');
        cy.wait('@getEdificio');

        cy.get('button').click();

        cy.get('[name="app-message"]').contains("Código do edifício A não pode ser vazio!");
        cy.get('[name="app-message"]').contains("Código do edifício B não pode ser vazio!");
 
    });

    it ('Editar passagem falha se nao existir', () => {

        cy.visit('/editarPassagem');
        cy.wait('@getEdificio');

        cy.get('[name="codigoEdificioA"]').select('T1');
        cy.wait('@getPisosEdificioA');
        cy.get('[name="codigoEdificioB"]').select('T2');
        cy.wait('@getPisosEdificioB');
        cy.get('[name="numeroPisoA"]').select('1');
        cy.get('[name="numeroPisoB"]').select('1');
        cy.get('[name="id"]').type('1000000');

        cy.get('button').click();

        cy.get('[name="app-message"]').contains("Editar passagem entre pisos falhou: A passagem com o id 1000000 não existe");
    });

    it('Editar passagem sucesso e2e', () => {
        cy.visit('/editarPassagem');
        cy.wait('@getEdificio');

        cy.get('[name="codigoEdificioA"]').select('T1');
        cy.wait('@getPisosEdificioA');
        cy.get('[name="codigoEdificioB"]').select('T2');
        cy.wait('@getPisosEdificioB');
        cy.get('[name="numeroPisoA"]').select('1');
        cy.get('[name="numeroPisoB"]').select('1');
        cy.get('[name="id"]').type('999999');

        cy.get('button').click();
        
        cy.get('[name="app-message"]').contains('passagem com id: 999999, codigoEdificioA: T1, codigoEdificioB: T2, numeroPisoA: 1, numeroPisoB: 1 editado com sucesso!');

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
