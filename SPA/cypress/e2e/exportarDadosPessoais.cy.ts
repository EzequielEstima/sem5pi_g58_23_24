describe('Exportar Dados Pessoais', () => {

    beforeEach(() => {
        cy.intercept('POST', '/api/user/signup').as('signup');
        cy.intercept('POST', '/api/user/login').as('login');
        cy.intercept('PUT', '/api/user').as('alterarDadosUser');
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
        cy.get('[name="email"]').type('utilizadortesteAlterar@isep.ipp.pt');
        cy.get('[name="telefone"]').type('912345678');
        cy.get('[name="nif"]').type('123123123');
        cy.get('button').click();
        cy.wait('@signup')
        cy.get('[class="logout"]').click();

        //Login com o utilizador criado
        cy.visit('/login');
        cy.get('[name="email"]').type('utilizadortesteAlterar@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login')
    });

    it('Os dados exportados com sucesso!', () => {
        cy.intercept('GET', '/api/user/utente').as('exportarDados');
        cy.visit('/exportarDadosPessoais')
        cy.get('button').click();
        cy.wait('@exportarDados');
        cy.get('[name="app-message"]').contains("Os dados foram exportados com sucesso!");
    });
})
