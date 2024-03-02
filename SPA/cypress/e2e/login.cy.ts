describe('Login', () => {

    beforeEach(() => {

        cy.intercept('POST', '/api/user/signup').as('signup');
        cy.intercept('POST', '/api/user/login').as('login');
        cy.intercept('DELETE', '/api/user/utente').as('deleteUtente');

        //Criar um utilizador para testar o login
        cy.visit('/login');
        cy.get('[name="email"]').type('1211469@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login')

        cy.visit('/registar');
        cy.get('[name="role"]').select('utente');
        cy.get('[name="name"]').type('UtilizadorTeste');
        cy.get('[name="password"]').type('Password10@');
        cy.get('[name="email"]').type('utilizadortesteLogin@isep.ipp.pt');
        cy.get('[name="telefone"]').type('912345678');
        cy.get('[name="nif"]').type('123123123');
        cy.get('button').click();
        cy.wait('@signup')
        cy.get('[class="logout"]').click();

    });

    it('login tem sucesso', () => {
        cy.visit('/login');
        cy.get('[name="email"]').type('utilizadorTesteLogin@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login').then((interception) => {
            expect(interception?.response?.statusCode).to.equal(200);
        });

    });

    afterEach(() => {
        cy.visit('/deleteUtente');
        cy.get('[name="delete"]').type('delete');
        cy.get('button').click();
        cy.wait('@deleteUtente')
        cy.get('[name="app-message"]').contains("Delete Utente com sucesso!");
    });
})
