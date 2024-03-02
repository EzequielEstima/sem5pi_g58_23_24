describe('Aprovar ou rejeitar registo', () => {

    beforeEach(() => {

        cy.intercept('PATCH', '/api/user/approveOrReject').as('approveOrReject');
        cy.intercept('DELETE', '/api/user/utente').as('deleteUtente');
        cy.intercept('GET', '/api/user/listarUtilizadoresPendentes').as('listarUtilizadoresPendentes');
        cy.intercept('POST', '/api/user/signup').as('signup');
        cy.intercept('POST', '/api/user/signupUtente').as('signupUtente');
        cy.intercept('POST', '/api/user/login').as('login');

        //Criar um utilizador para testar o login
        cy.visit('/registar');
        cy.get('[name="name"]').type('AdminTeste');
        cy.get('[name="password"]').type('Password10@');
        cy.get('[name="email"]').type('adminTeste@isep.ipp.pt');
        cy.get('[name="telefone"]').type('912345678');
        cy.get('[name="role"]').select('admin');
        cy.get('button').click();
        cy.wait('@signup')

        //Fazer login
        cy.visit('/login');
        cy.get('[name="email"]').type('adminTeste@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login')
    });

    it('loading da pagina', () => {
        cy.visit('/approveOrRejectUtente');

        cy.get('select[name="selectUser"]').should('exist');
        cy.get('select[name="selectEstado"]').should('exist');

        cy.get('button').should('exist');
    });

    it('aprovar registo', () => {

        cy.visit('/signupUtente');
        cy.get('[name="name"]').type('nome');
        cy.get('[name="email"]').type('emailtestetesteteste@isep.ipp.pt');~
        cy.get('[name="telemovel"]').type('913456789');
        cy.get('[name="nif"]').type('123456789');
        cy.get('[name="password"]').type('Password10@');
        cy.get('[id="checkbox"]').check();
        cy.get('button').click();
        cy.wait('@signupUtente')

        cy.visit('/login');
        cy.get('[name="email"]').type('1211469@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login')

        cy.visit('/approveOrRejectUtente')
        cy.wait('@listarUtilizadoresPendentes')
        cy.get('[name="selectUser"]').select('emailtestetesteteste@isep.ipp.pt');
        cy.get('[name="selectEstado"]').select('Aceitar');
        cy.get('button').click();
        cy.wait('@approveOrReject')

        cy.get('[name="app-message"]').contains("Estado do utilizador alterado com sucesso!");


        cy.visit('/login');
        cy.get('[name="email"]').type('emailtestetesteteste@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login')
             
        cy.visit('/deleteUtente');
        cy.get('[name="delete"]').type('delete');
        cy.get('button').click();
        cy.wait('@deleteUtente')

        cy.get('[name="app-message"]').contains("Delete Utente com sucesso!");
    });

    it('rejeitar registo', () => {

        cy.visit('/signupUtente');
        cy.get('[name="name"]').type('nome');
        cy.get('[name="email"]').type('emailtestetesteteste@isep.ipp.pt');~
        cy.get('[name="telemovel"]').type('913456789');
        cy.get('[name="nif"]').type('123456789');
        cy.get('[name="password"]').type('Password10@');
        cy.get('[id="checkbox"]').check();
        cy.get('button').click();
        cy.wait('@signupUtente')

        cy.visit('/login');
        cy.get('[name="email"]').type('1211469@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login')

        cy.visit('/approveOrRejectUtente')
        cy.wait('@listarUtilizadoresPendentes')
        cy.get('[name="selectUser"]').select('emailtestetesteteste@isep.ipp.pt');
        cy.get('[name="selectEstado"]').select('Rejeitar');
        cy.get('button').click();
        cy.wait('@approveOrReject')

        cy.get('[name="app-message"]').contains("Estado do utilizador alterado com sucesso!");


        cy.visit('/login');
        cy.get('[name="email"]').type('emailtestetesteteste@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login')
             
        cy.visit('/deleteUtente');
        cy.get('[name="delete"]').type('delete');
        cy.get('button').click();
        cy.wait('@deleteUtente')

        cy.get('[name="app-message"]').contains("Delete Utente com sucesso!");
    });

});
