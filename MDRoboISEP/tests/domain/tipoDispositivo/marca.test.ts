import {expect} from 'chai';
import {it} from 'mocha';
import { Marca } from '../../../src/domain/tipoDispositivo/Marca';

describe('teste do Marca de um tipo de Dispositivo', () => {
    //Valores válidos para Marca de um tipo de Dispositivo
    let marca1 = 'Marca1';
    let marca2 = 'Marca 2';
    let marca3 = '';
    for(let i = 0; i < 50; i++){
        marca3 += 'a';
    }
    //Valores inválidos para Marca de um tipo de Dispositivo
    let marcaInvalida1 = '';
    let marcaInvalida2 = '****_*';
    let marcaInvalida3 = '';
    for(let i = 0; i < 51; i++){
        marcaInvalida3 += 'a';
    }
    //Testes de Marca Válidos

    it('criação de uma marca normal', () => {
        const resultado = Marca.create(marca1);
        expect(true).to.equal(resultado.isSuccess);
    });
    it('criação de uma marca normal com espaços', () => {
        const resultado = Marca.create(marca2);
        expect(true).to.equal(resultado.isSuccess);
    });
    it('criação de uma marca normal com limite de caratéres', () => {
        const resultado = Marca.create(marca3);
        expect(true).to.equal(resultado.isSuccess);
    });

    //Testes de Marca Inválidos

    it('criação de uma marca sem caratéres', () => {
        const resultado = Marca.create(marcaInvalida1);
        expect(false).to.equal(resultado.isSuccess);
    });
    it('criação de uma marca com caratéres especiais', () => {
        const resultado = Marca.create(marcaInvalida2);
        expect(false).to.equal(resultado.isSuccess);
    });
    it('criação de uma marca acima do limite de caratéres', () => {
        const resultado = Marca.create(marcaInvalida3);
        expect(false).to.equal(resultado.isSuccess);
    });
});