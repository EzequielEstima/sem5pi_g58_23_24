var id : string;

describe('Aprovar tarefa da frota', () => {

    
    beforeEach(() => {
        cy.intercept('POST', '/api/user/login').as('login');
        cy.intercept('POST', '/api/Tarefa').as('createTarefa');
        cy.intercept('GET', '/api/dispositivo/tipoTarefa').as('dispositivo');
        cy.intercept('GET', '/api/Tarefa/tarefasPendentes').as('tarefasPendentes');
        cy.intercept('PUT', '/api/Tarefa').as('alterarEstado');

        cy.visit('/login');
        cy.get('[name="email"]').type('1211417@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login');

        cy.visit('/criarTarefaPickUpDelivery');
        cy.get('[name="codConf"]').type('12345');
        cy.get('[name="desc"]').type("desc");
        cy.get('[name="nomePickUp"]').type('ABC');
        cy.get('[name="numeroPickUp"]').type('123456789');
        cy.get('[name="nomeDelivery"]').type('ABC');
        cy.get('[name="numeroDelivery"]').type('123456789');
        cy.get('[name="salaInicial"]').type('A203');
        cy.get('[name="salaFinal"]').type('A202');
        
        
        cy.get('button').click();
        cy.wait('@createTarefa', { timeout: 100000 }).then((interception) => {
            expect(interception?.response?.statusCode).to.eq(201);
            id = interception.response?.body.id;
        })
        cy.get('[class="logout"]').click();

        cy.visit('/login');
        cy.get('[name="email"]').type('gestortarefas@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login');
    

    });

    it('listar TarefasPendentes Tem O Formato Esperado', () => {
        
        cy.visit('/aprovarTarefas');
        cy.wait('@tarefasPendentes');
        
        cy.get('th').should('contain', 'Id Tarefa');
        cy.get('th').should('contain', 'Tipo de Tarefa');
        cy.get('th').should('contain', 'Sala Inicial - SalaFinal');
        cy.get('th').should('contain', 'Edificio - Piso');
        cy.get('th').should('contain', 'Email do Requisitador');
        cy.get('th').should('contain', 'Aprovar/Recusar');

            
    });

    it('recusar tarefa tem sucesso', () => {
        
        cy.visit('/aprovarTarefas');
        cy.wait('@tarefasPendentes');
        
        cy.contains('td', id.toLowerCase()).parent('tr').find('.buttonRecusar').click();
        cy.wait('@alterarEstado')
        cy.get('[name="app-message"]').contains("Tarefa " + id.toLowerCase() + " foi rejeitada");

            
    });

    it('aceitar tarefa tem sucesso', () => {
        
        cy.visit('/aprovarTarefas');
        cy.wait('@tarefasPendentes');
        
        cy.contains('td', id.toLowerCase()).parent('tr').find('.buttonAprovar').click();
        cy.wait('@dispositivo');
        cy.get('[name="codigo"]').select('FazTudo');
        cy.contains('button', 'Aprovar Tarefa').click();
        cy.wait('@alterarEstado')
        cy.get('[name="app-message"]').contains("Tarefa " + id.toLowerCase() + " foi aceite e irá ser feita pelo robo FazTudo");

            
    });


    afterEach(() => {


        cy.intercept('DELETE', '/api/Tarefa?id='+id).as('deleteTarefa');
        cy.visit('/apagarTarefa');
        cy.get('[name="id"]').type(id);
        cy.get('button').click();
        cy.wait('@deleteTarefa').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(200);
        })
        cy.get('[class="logout"]').click();

    });
    
});



