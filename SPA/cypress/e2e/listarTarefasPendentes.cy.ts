describe('Listar Tarefas Pendentes', () => {
    
    beforeEach(() => {


        cy.intercept('POST', '/api/Tarefa').as('createTarefa');
        cy.intercept('GET', '/api/Tarefa/tarefasPendentes').as('tarefasPendentes');
        cy.intercept('POST', '/api/user/login').as('login');

        cy.visit('/login');
        cy.get('[name="email"]').type('gestortarefas@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login');
    
    });
    
    it('Listar tarefas com sucesso', () => {
        let tarefasIdsAntesDeCriar: string[] = [];
        let tarefasIdsDepoisDeCriar: string[] = [];
    
        //verficar tarefas anteriores
        cy.visit('/listarTarefasPendentes')
        cy.wait('@tarefasPendentes');
        cy.get('.conteudo tr:not(:first-child) td:first-child').each(($element) => {
            const tarefaId = $element.text().trim();
            tarefasIdsAntesDeCriar.push(tarefaId);
        });
    
        // criar tarefa
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
        let id;
        cy.wait('@createTarefa', { timeout: 100000 }).then((interception) => {
            id = interception.response?.body.id;
        });
    
        cy.visit('/login');
        cy.get('[name="email"]').type('gestortarefas@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login');

            // After creating a new tarefa, navigate back to the listarTarefasPendentes page
        cy.visit('/listarTarefasPendentes')
        cy.wait('@tarefasPendentes');
            
            // tarefas pendentes depois de criada
            cy.get('.conteudo tr:not(:first-child) td:first-child').each(($element) => {
                const tarefaId = $element.text().trim();
                tarefasIdsDepoisDeCriar.push(tarefaId);
            });
    
            cy.wrap(null).should(() => {
                expect(tarefasIdsDepoisDeCriar).to.have.lengthOf(tarefasIdsAntesDeCriar.length + 1);
            });
            
            
            // apagar tarefa
            cy.intercept('DELETE', '/api/Tarefa?id=').as('apagarTarefa');
            for(let i = 0; i < tarefasIdsDepoisDeCriar.length; i++) {
                if(!tarefasIdsAntesDeCriar.includes(tarefasIdsDepoisDeCriar[i])) {
                    cy.visit('/apagarTarefa');
                    cy.get('[name="id"]').type(tarefasIdsDepoisDeCriar[i]);
                    cy.get('button').click();
                    cy.wait('@apagarTarefa');
                    break;
                }
            }
    });
});
