import {expect} from 'chai';
import {it} from 'mocha';
import { Dimensao } from '../../../src/domain/edificio/Dimensao';

describe('teste da dimensao edificio', () => {
    //Valores válidos para criação de Dimensão
    let dimensaoX = 1;
    let dimensaoY = 1;

    //Valores inválidos para a criação da Dimensão
    let dimensaoInvalidaX1;
    let dimensaoInvalidaY1;
    let dimensaoInvalidaX2 = 0;
    let dimensaoInvalidaY2 = 0;
    let dimensaoInvalidaX3 = -1;
    let dimensaoInvalidaY3 = -1;

    //Testes de Dimensão Válidos

    it('Criação de uma dimensão normal', () => {
    const resultado= Dimensao.create(dimensaoX, dimensaoY);
    expect(true).to.equal(resultado.isSuccess);
    });

    //Testes de Dimensão Inválidos

    it('Criação de uma dimensão não inicializada', () => {
        const resultado = Dimensao.create(dimensaoInvalidaX1, dimensaoInvalidaY1);
        expect(false).to.equal(resultado.isSuccess);
    });

    it('Criação de uma dimensão com valores a 0', () => {
        const resultado = Dimensao.create(dimensaoInvalidaX2, dimensaoInvalidaY2);
        expect(false).to.equal(resultado.isSuccess);
    });

    it('Criação de uma dimensão com valores a -1', () => {
        const resultado = Dimensao.create(dimensaoInvalidaX3, dimensaoInvalidaY3);
        expect(false).to.equal(resultado.isSuccess);
    });
});