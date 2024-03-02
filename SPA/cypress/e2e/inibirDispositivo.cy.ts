import { method } from "cypress/types/bluebird";

var id : string;

describe('Inibir dispositivos', () => {

    
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

        //Criar um dispositivo
        cy.visit('/adicionarDispositivo');
        cy.get('[name="codigo"]').type('COD1');
        cy.get('[name="nickname"]').type('NICK');
        cy.get('[name="idTipoDispositivo"]').type(id);
        cy.get('[name="numeroSerie"]').type('123');
        cy.get('[name="descricao"]').type('Desc1');
        cy.get('button').click();
        cy.wait('@createDispositivo');
        cy.intercept('DELETE', '/api/tipoDispositivo?idTipoDispositivo='+id).as('apagarTipoRobo');

        });        
    });

    it('Inibir dispositivo input load de pagina', () => {
        cy.visit('/inibirDispositivo');
        cy.get('[name="codigo"]').find('option:first-child').should('have.text', 'Codigo Dispositivo *')

    })
   

    it('Inibir dispositivo falha sem dados', () => {
        cy.visit('/inibirDispositivo');
        cy.get('button').click();

        cy.get('[name="app-message"]').contains("ERRO: Código deve ser preenchido.");
    })

    it('Inibir dispositivo sucesso e2e', () => {
        cy.visit('/inibirDispositivo');
        cy.get('[name="codigo"]').select('COD1');
        cy.get('button').click();

        cy.get('[name="app-message"]').contains("Estado alterado com sucesso!");
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

