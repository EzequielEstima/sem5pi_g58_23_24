describe('Signup Utente', () => {

    beforeEach(() => {
        
        cy.intercept('POST', '/api/user/signupUtente').as('signupUtente');
        cy.intercept('DELETE', '/api/user/utente').as('deleteUtente');
        cy.intercept('PATCH', '/api/user/approveOrReject').as('aprovarUtente');
        cy.intercept('POST', '/api/user/login').as('login');
        cy.intercept('GET', '/api/user/listarUtilizadoresPendentes').as('listarUtilizadoresPendentes');
    });

    it('Signup utente input load de pagina', () => {    
        cy.visit('/signupUtente')

        cy.get('[name="name"]').should('have.attr', 'placeholder', 'Nome *');
        cy.get('[name="email"]').should('have.attr', 'placeholder', 'Email *');
        cy.get('[name="telemovel"]').should('have.attr', 'placeholder', 'Número de Telefone *');
        cy.get('[name="nif"]').should('have.attr', 'placeholder', 'Número de Contribuinte *');
        cy.get('[name="password"]').should('have.attr', 'placeholder','Password *');
        

    });

    it('Signup utente falha sem inserir informação', () => {
        cy.visit('/signupUtente');
        cy.get('[id="checkbox"]').check();
        cy.get('button').click();
        
        cy.get('[name="app-message"]').contains("Preencha todos os campos");
 
    });

    it('Signup utente falha sem aceitar os termos de uso', () => {
        cy.visit('/signupUtente');
        cy.get('button').click();
        cy.get('[name="app-message"]').contains("Deve aceitar os termos e condições.");
 
    });

    it('Signup tem sucesso', () => {
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

        cy.visit('/deleteUtente');
        cy.get('[name="delete"]').type('delete');
        cy.get('button').click();
        cy.wait('@deleteUtente')

    });
    


    afterEach(() => {
      
    });
})
