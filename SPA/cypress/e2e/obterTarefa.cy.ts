describe('Obter Tarefa', () => {

    beforeEach(() => {
        cy.intercept('GET', '/api/tarefa/obterTarefa').as('obterTarefa');
        cy.intercept('GET', '/api/edificio').as('getEdificio');
        cy.intercept('POST', '/api/user/login').as('login');
        cy.intercept('POST', '/api/user/signup').as('signup');
        cy.intercept('DELETE', '/api/user/utente').as('deleteUtente');
    });

    it('load da pagina', () => {
        cy.visit('/obterTarefa');
        cy.get('select[name="criterio"]').should('exist');
        cy.get('select[name="criterio"] option').should('have.length', 4);
        cy.get('select[name="criterio"] option').eq(1).should('have.value', 'estado');
        cy.get('select[name="criterio"] option').eq(2).should('have.value', 'tipo');
        cy.get('select[name="criterio"] option').eq(3).should('have.value', 'utente');
        cy.get('select[name="criterio"]').select('estado');
        cy.get('select[name="estado"]').should('exist');
        cy.get('select[name="estado"] option').should('have.length', 4);
        cy.get('select[name="criterio"]').select('utente');
        cy.get('[name="email"]').should('exist');
        cy.get('[name="email"]').should('have.attr', 'placeholder', 'Email do Utente');
        cy.get('[name="email"]').type('email@isep.ipp.pt');
        cy.get('select[name="criterio"]').select('tipo');
        cy.get('select[name="tipo"]').should('exist');
        cy.get('select[name="tipo"] option').should('have.length', 3);
        cy.get('select[name="tipo"] option').eq(1).should('have.value', 'Vigilancia');
        cy.get('select[name="tipo"] option').eq(2).should('have.value', 'PickUpDelivery');
        cy.get('select[name="tipo"]').select('Vigilancia');

        cy.get('button').should('exist');

    });

    it('Obter tarefa com sucesso', () => {

        cy.visit('/registar');
        cy.get('[name="name"]').type('GestorTarefa');
        cy.get('[name="password"]').type('Password10@');
        cy.get('[name="email"]').type('tarefateste@isep.ipp.pt');
        cy.get('[name="telefone"]').type('912345678');
        cy.get('[name="role"]').select('Gestor de Tarefas');
        cy.get('button').click();
        cy.wait('@signup')

        //Fazer login
        cy.visit('/login');
        cy.get('[name="email"]').type('tarefateste@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login')

        cy.visit('/obterTarefa');
        cy.get('select[name="criterio"]').select('estado');
        cy.get('select[name="estado"]').select('Pendente');
        cy.get('button').click();
        cy.get('[name="app-message"]').should('exist');

        cy.visit('/login');
        cy.get('[name="email"]').type('tarefateste@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login')

        cy.visit('/deleteUtente');
        cy.get('[name="delete"]').type('delete');
        cy.get('button').click();
        cy.wait('@deleteUtente')
        

    });
});