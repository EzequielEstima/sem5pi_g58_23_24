import {expect} from 'chai';
import {it} from 'mocha';
import NomeSala from '../../../src/domain/sala/NomeSala';

describe('Nome da Sala Domain', () => {
    //Valores válidos para criação de um Código
    let codigo1 = 'A 2';
    let codigo2 = 'A235';
    let codigo3 = 'A2345';

    //Valores inválidos para criação de um Código
    let codigoInvalido1 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    let codigoInvalido2 : string ;
    
    //Testes de Nomes Válidos

    it('Criação de um nome normal com espaços', () => {
    const resultadoCodigoEdificio1= NomeSala.create(codigo1);
    expect(true).to.equal(resultadoCodigoEdificio1.isSuccess);
    });

    it('Criação de um nome normal sem espaços', () => {
        const resultadoCodigoEdificio2 = NomeSala.create(codigo2);
        expect(true).to.equal(resultadoCodigoEdificio2.isSuccess);
    });

    it('Criação de um nome com limite de caratéres', () => {
        const resultadoCodigoEdificio3 = NomeSala.create(codigo3);
        expect(true).to.equal(resultadoCodigoEdificio3.isSuccess);
    });


    //Testes de Nomes Inválidos

    it('Não se pode criar um nome com mais de 50 carateres', () => {
        const resultadoCodigoEdificio1 = NomeSala.create(codigoInvalido1);
        expect(resultadoCodigoEdificio1.errorValue()).to.equal("id must be null, empty, or have a length less than 50.");
    });

    it('Não se pode criar um nome nulo', () => {
        const resultadoCodigoEdificio2 = NomeSala.create(codigoInvalido2);
        expect(resultadoCodigoEdificio2.errorValue()).to.equal("id is null or undefined");
    });

});