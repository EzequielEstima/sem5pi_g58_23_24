describe('Criar Sala', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/edificio').as('createEdificio');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('POST', '/api/piso').as('createPiso');
        cy.intercept('GET', '/api/piso').as('getPiso');
        cy.intercept('POST', '/api/sala').as('createSala');
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

        //Criar piso
        cy.visit('/criarPiso');
        cy.wait('@getEdificio');

        cy.get('[id="codigo"]').select('T1');
        cy.get('[name="numeroPiso"]').type('1');
        cy.get('[name="descricaoPiso"]').type('Descricao1');

        cy.get('button').click();
        cy.wait('@createPiso');

    });

    it('Criar passagem input load de pagina', () => {
           cy.visit('/criarSala');
            cy.wait('@getEdificio');
    
            cy.get('[name="codigoEdificio"]').find('option:first-child').should('have.text', 'Codigo Edificio *')
            cy.get('[name="id"]').should('have.attr', 'placeholder', 'Nome da Sala *');
            cy.get('[name="numeroPiso"]').should('have.attr', 'placeholder', 'Numero do Piso *');
            cy.get('[name="descricao"]').should('have.attr', 'placeholder', 'Descricao da sala *');
            cy.get('[name="categoria"]').find('option:first-child').should('have.text', 'Categoria da Sala *')             
    });

    it('Criar sala falha sem dados', () => {
        cy.visit('/criarSala');
        cy.wait('@getEdificio');

        cy.get('button').click();

        cy.get('[name="app-message"]').contains("Adicionar sala ao piso falhou: [object Object]");
 
    });

    it('Criar sala sucesso e2e', () => {
        cy.visit('/criarSala');
        cy.wait('@getEdificio');

        cy.get('[name="codigoEdificio"]').select('T1');
        cy.get('[name="id"]').type('salaPorofessorGG');
        cy.get('[name="numeroPiso"]').type('1');
        cy.get('[name="descricao"]').type('Descricao1');
        cy.get('[name="categoria"]').select('Gabinete');

        cy.get('button').click();
        cy.wait('@createSala').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(201); // Adjust the status code as needed
        });;

        cy.get('[name="app-message"]').contains('sala com id: salaPorofessorGG, codigoEdificio: T1, numeroPiso: 1, descricao: Descricao1, categoria: Gabinete criada com sucesso!');

    })

    it('Criar sala falha se ja existir', () => {
        cy.visit('/criarSala');
        cy.wait('@getEdificio');

        cy.get('[name="codigoEdificio"]').select('T1');
        cy.get('[name="id"]').type('salaPorofessorGG');
        cy.get('[name="numeroPiso"]').type('1');
        cy.get('[name="descricao"]').type('Descricao1');
        cy.get('[name="categoria"]').select('Gabinete');

        cy.get('button').click({ multiple: true });
        cy.wait('@createSala').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(201); // Adjust the status code as needed
        });;

        cy.get('button').click({ multiple: true });
        cy.wait('@createSala').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(400); // Adjust the status code as needed
        });;

        cy.get('[name="app-message"]').contains('Adicionar sala ao piso falhou: Sala já existe');

    })


    afterEach(() => {
        cy.visit('/apagarEdificio');
        cy.get('[name="codigo"]').type('T1');
        cy.get('button').click();
        cy.wait('@apagarEdificio');

        cy.get('[class="logout"]').click();
    });
})
