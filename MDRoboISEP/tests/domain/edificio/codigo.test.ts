import {expect} from 'chai';
import {it} from 'mocha';
import { Codigo } from '../../../src/domain/edificio/Codigo';

describe('teste do codigo edificio', () => {
    //Valores válidos para criação de um Código
    let codigo1 = 'A 2';
    let codigo2 = 'A235';
    let codigo3 = 'A2345';

    //Valores inválidos para criação de um Código
    let codigoInvalido1 = '';
    let codigoInvalido2 = '****_*';
    let codigoInvalido3 = '';
    for(let i = 0; i < 6; i++){
        codigoInvalido3 += 'a';
    }
    //Testes de Código Válidos

    it('Criação de um código normal com espaços', () => {
    const resultadoCodigoEdificio1= Codigo.create(codigo1);
    expect(true).to.equal(resultadoCodigoEdificio1.isSuccess);
    });

    it('Criação de um código normal sem espaços', () => {
        const resultadoCodigoEdificio2 = Codigo.create(codigo2);
        expect(true).to.equal(resultadoCodigoEdificio2.isSuccess);
    });

    it('Criação de um código com limite de caratéres', () => {
        const resultadoCodigoEdificio3 = Codigo.create(codigo3);
        expect(true).to.equal(resultadoCodigoEdificio3.isSuccess);
    });


    //Testes de Códigos Inválidos

    it('Criação de um código sem caratéres', () => {
        const resultadoCodigoEdificio1 = Codigo.create(codigoInvalido1);
        expect(false).to.equal(resultadoCodigoEdificio1.isSuccess);
    });

    it('Criação de um código com caratéres especiais', () => {
        const resultadoCodigoEdificio2 = Codigo.create(codigoInvalido2);
        expect(false).to.equal(resultadoCodigoEdificio2.isSuccess);
    });

    it('Criação de um código com caratéres em excesso', () => {
        const resultadoCodigoEdificio3 = Codigo.create(codigoInvalido3);
        expect(false).to.equal(resultadoCodigoEdificio3.isSuccess);
    });
});