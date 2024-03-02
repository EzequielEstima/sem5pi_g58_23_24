import { method } from "cypress/types/bluebird";

var id : string;

describe('Listar dispositivos da frota', () => {

    
    beforeEach(() => {
        
        cy.intercept('POST', '/api/tipoDispositivo').as('createTipoDispositivo');
        cy.intercept('POST', '/api/dispositivo').as('createDispositivo');
        
        cy.intercept('POST', '/api/user/login').as('login');
        cy.visit('/login');
        cy.get('[name="email"]').type('gestorfrota@isep.ipp.pt');
        cy.get('[name="password"]').type('Password10@');
        cy.get('button').click();
        cy.wait('@login');

        //Criar um tipo de dispositivo
        cy.visit('/criarTipoRobo')
        cy.get('[name="marcaTipoRobo"]').type('Marca1');
        cy.get('[name="modeloTipoRobo"]').type('Modelo1');
        cy.contains('label', 'Vigilância').find('input[type="checkbox"]').check();
        cy.get('button').click();
        cy.wait('@createTipoDispositivo');
        
        cy.get('[name="app-message"]')
        .invoke('text').then((messageText) => {
            id = extractIdFromMessage(messageText);
            cy.intercept('DELETE', '/api/tipoDispositivo?idTipoDispositivo='+id).as('apagarTipoRobo');
        });



    });

    it('Criar dispositivo input load de pagina', () => {
        cy.visit('/adicionarDispositivo');
        cy.get('[name="codigo"]').should('have.attr', 'placeholder', 'Código *');
        cy.get('[name="nickname"]').should('have.attr', 'placeholder', 'Nickname *');
        cy.get('[name="idTipoDispositivo"]').should('have.attr', 'placeholder', 'Id do Tipo de Dispositivo *');
        cy.get('[name="numeroSerie"]').should('have.attr', 'placeholder', 'Número de Série *');
        cy.get('[name="descricao"]').should('have.attr', 'placeholder', 'Descrição');
    })

    it('criar dispositivos sem dados falha e2e', () => {
        cy.visit('/adicionarDispositivo');
        cy.get('button').click();
            

        cy.get('[name="app-message"]').contains("ERRO: Código deve ser preenchido.");
        cy.get('[name="app-message"]').contains("ERRO: Nickname deve ser preenchido.");
        cy.get('[name="app-message"]').contains("ERRO: Id Tipo Dispositivo deve ser preenchido.");
        cy.get('[name="app-message"]').contains("ERRO: Número de Série deve ser preenchido.");
        
    })

    it('criar dispositivos sucesso e2e', () => {
        cy.visit('/adicionarDispositivo');
            cy.get('[name="codigo"]').type('COD1');
            cy.get('[name="nickname"]').type('NICK');
            cy.get('[name="idTipoDispositivo"]').type(id);
            cy.get('[name="numeroSerie"]').type('123');
            cy.get('[name="descricao"]').type('Desc1');
            cy.get('button').click();
            cy.wait('@createDispositivo');

            cy.get('[name="app-message"]').contains("Dispositivo com código: COD1, estado: true, nickname: NICK, número de Série: 123, descrição: \"Desc1\" criado com sucesso!");
    })

    afterEach(() => {
        if (id) {
            cy.visit('/apagarTipoRobo');
            cy.get('[name="id"]').type(id);
            cy.get('button').click();
            cy.wait('@apagarTipoRobo');
        } else {
            cy.log('Erro');
        }
        cy.get('[class="logout"]').click();
    });
    
});

function extractIdFromMessage(messageText:string) {

    const idRegex = /id (\w+)/;
    const match = messageText.match(idRegex);
    return match ? match[1] : 'no id';
  }

