describe('Editar Piso', () => {

    beforeEach(() => {
            
        cy.intercept('POST', '/api/edificio').as('createEdificio');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('POST', '/api/piso').as('createPiso');
        cy.intercept('GET', '/api/piso?codigo=T1').as('getPisosEdificio');
        cy.intercept('PUT', '/api/piso').as('editPiso');
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


    it('Editar piso input load de pagina', () => {
        
        cy.visit('/editarPiso');
        cy.wait('@getEdificio');

        cy.get('[formControlName="codigo"]').find('option:first-child').should('have.text', 'Codigo Edificio*');
        cy.get('[formControlName="numeroPiso"]').find('option:first-child').should('have.text', 'Numero Piso*');
        cy.get('[id="novoNumeroPiso"]').should('have.attr', 'placeholder', 'Novo Numero do Piso');
        cy.get('[id="descricaoPiso"]').should('have.attr', 'placeholder', 'Nova Descrição do Piso');
        
    })

    it('Editar piso sem dados falho', () => {
        cy.visit('/editarPiso');
        cy.wait('@getEdificio');

        cy.get('[formControlName="codigo"]').find('option:first-child').should('have.text', 'Codigo Edificio*');
        cy.get('[formControlName="numeroPiso"]').find('option:first-child').should('have.text', 'Numero Piso*');
        cy.get('[id="novoNumeroPiso"]').should('have.attr', 'placeholder', 'Novo Numero do Piso');
        cy.get('[id="descricaoPiso"]').should('have.attr', 'placeholder', 'Nova Descrição do Piso');~

        cy.get('button').click();

        cy.get('[name="app-message"]').contains("ERRO: Código deve ser preenchido.");
        cy.get('[name="app-message"]').contains("ERRO: Número do Piso deve ser preenchido.");

        
    })


    it('Editar piso sucesso e2e', () => {
        //Criar piso
        cy.visit('/editarPiso');
        cy.wait('@getEdificio');
    
        cy.get('[id="codigo"]').select('T1');
        cy.wait('@getPisosEdificio');

        cy.get('[formControlName="numeroPiso"]').select('1');
        cy.get('[id="novoNumeroPiso"]').type('2');
        cy.get('[id="descricaoPiso"]').type('BomDiaZe');
    
        cy.get('button').click();

        cy.wait('@editPiso').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(200); // Adjust the status code as needed
        });;

        cy.get('[name="app-message"]').contains('Número Piso: 2, descrição: BomDiaZe atualizado com sucesso!');
        
    })


    afterEach(() => {
        cy.visit('/apagarEdificio');
        cy.get('[name="codigo"]').type('T1');
        cy.get('button').click();
        cy.wait('@apagarEdificio');

        cy.get('[class="logout"]').click();
    });
})