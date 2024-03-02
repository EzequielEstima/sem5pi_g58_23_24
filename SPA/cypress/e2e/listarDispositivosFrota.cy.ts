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


    it('listar dispositivos da frota sucesso e2e', () => {
        cy.intercept('GET', '/api/dispositivo').as('getDispositivosFrota');

        cy.visit('/listarDispositivosFrota');
        cy.wait('@getDispositivosFrota').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(200);
        });

        cy.get('p-table').contains('COD1');
        cy.get('p-table').contains('NICK');
        cy.get('p-table').contains('123');
        cy.get('p-table').contains('Desc1');
        
    })

    afterEach(() => {
        cy.visit('/apagarTipoRobo');
        cy.get('[name="id"]').type(id);
        cy.get('button').click();
        cy.wait('@apagarTipoRobo');

        cy.get('[class="logout"]').click();

    });
    
});

function extractIdFromMessage(messageText:string) {

    const idRegex = /id (\w+)/;
    const match = messageText.match(idRegex);
    return match ? match[1] : 'no id';
  }

