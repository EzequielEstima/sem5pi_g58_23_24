describe('Listar Piso', () => {

    beforeEach(() => {

        cy.intercept('POST', '/api/edificio').as('createEdificio');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('POST', '/api/piso').as('createPiso');
        cy.intercept('POST', '/api/passagem').as('createPassagem');
        cy.intercept('GET', '/api//passagem/listarPisosComPassagens').as('getPassagens');
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

    it('Listar pisos com passagem com sucesso', () => {
        cy.visit('/listarPisoPassagem');
        cy.wait('@getPassagens');

        // Encuentra todos los elementos 'td' dentro de 'table' y verifica que cada uno no esté vacío
        cy.get('table').find('td').each(($td) => {
            // Asegúrate de que el texto dentro del 'td' no esté vacío
            expect($td.text().trim()).not.to.eq('');
        });
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