import {expect} from 'chai';
import {it} from 'mocha';
import { Modelo } from '../../../src/domain/tipoDispositivo/Modelo';

describe('teste do Modelo de um tipo de Dispositivo', () => {
    //Valores válidos para Modelo de um tipo de Dispositivo
    let modelo1 = 'Modelo1';
    let modelo2 = 'Modelo 2';
    let modelo3 = '';
    for(let i = 0; i < 100; i++){
        modelo3 += 'a';
    }
    //Valores inválidos para Marca de um tipo de Dispositivo
    let modeloInvalido1 = '';
    let modeloInvalido2 = '****_*';
    let modeloInvalido3 = '';
    for(let i = 0; i < 101; i++){
        modeloInvalido3 += 'a';
    }
    //Testes de Modelos Válidos

    it('criação de um modelo normal', () => {
        const resultado = Modelo.create(modelo1);
        expect(true).to.equal(resultado.isSuccess);
    });
    it('criação de um modelo com espaços', () => {
        const resultado = Modelo.create(modelo2);
        expect(true).to.equal(resultado.isSuccess);
    });
    it('criação de uma modelo normal com limite de caratéres', () => {
        const resultado = Modelo.create(modelo3);
        expect(true).to.equal(resultado.isSuccess);
    });

    //Testes de Modelos Inválidos

    it('criação de um modelo sem caratéres', () => {
        const resultado = Modelo.create(modeloInvalido1);
        expect(false).to.equal(resultado.isSuccess);
    });
    it('criação de um Modelo com caratéres especiais', () => {
        const resultado = Modelo.create(modeloInvalido2);
        expect(false).to.equal(resultado.isSuccess);
    });
    it('criação de um Modelo acima do limite de caratéres', () => {
        const resultado = Modelo.create(modeloInvalido3);
        expect(false).to.equal(resultado.isSuccess);
    });
});