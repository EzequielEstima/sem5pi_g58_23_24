describe('Delete Utente', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/user/signupUtente').as('signupUtente');
        cy.intercept('DELETE', '/api/user/utente').as('deleteUtente');
        cy.intercept('PATCH', '/api/user/approveOrReject').as('aprovarUtente');
        cy.intercept('POST', '/api/user/login').as('login');
        cy.intercept('GET', '/api/user/listarUtilizadoresPendentes').as('listarUtilizadoresPendentes');

        cy.visit('/signupUtente');
        cy.get('[name="name"]').type('nome');
        cy.get('[name="email"]').type('emailTesteTesteTeste@isep.ipp.pt');
        cy.get('[name="telemovel"]').type('913456789');
        cy.get('[name="nif"]').type('123456789');
        cy.get('[name="password"]').type('Password10@');
        cy.get('[id="checkbox"]').check();
        cy.get('button').click();
        cy.wait('@signupUtente')
        cy.get('[name="app-message"]').contains("Conta criada com sucesso!");
        
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
        cy.wait('@aprovarUtente')
        cy.get('[class="logout"]').click();

        cy.visit('/login');
        cy.get('[name="email"]').type('emailtestetesteteste@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login')
    });

    it('Delete utente input load de pagina', () => {    
        cy.visit('/deleteUtente')

        cy.get('[name="delete"]').should('have.attr', 'placeholder', 'Escreva \'delete\' caso deseja eliminar a conta*');

        cy.visit('/deleteUtente');
        cy.get('[name="delete"]').type('delete');
        cy.get('button').click();
        cy.wait('@deleteUtente')

    });

    it('Signup utente falha sem inserir "delete"', () => {
        cy.visit('/deleteUtente');
        cy.get('button').click();
        cy.get('[name="app-message"]').contains("Deve escrever 'delete' para confirmar a eliminação da conta.");

        cy.visit('/deleteUtente');
        cy.get('[name="delete"]').type('delete');
        cy.get('button').click();
        cy.wait('@deleteUtente')
     
 
    });

    it('Delete tem sucesso', () => {
        

        cy.visit('/deleteUtente');
        cy.get('[name="delete"]').type('delete');
        cy.get('button').click();
        cy.wait('@deleteUtente')
        cy.get('[name="app-message"]').contains("Delete Utente com sucesso!");

    });
    
})
