import {expect} from 'chai';
import { Nome } from '../../../src/domain/edificio/Nome';


describe('teste do nome de edificio', () => {
    //Valores válidos para criação de um nome
    let nome1 = 'Edificio 1';
    let nome2 = 'EdificioB';
    let nome3 = '';
    for(let i = 0; i < 50; i++){
        nome3 += 'a';
    }
    //Valores inválidos para criação de um nome
    let nomeInvalido1 = '';
    let nomeInvalido2 = '****_*';
    let nomeInvalido3 = '';
    for(let i = 0; i < 51; i++){
        nomeInvalido3 += 'a';
    }
    //Testes de Nomes Válidos

    it('Criação de um nome normal com espaços', () => {
        const resultadoNomeEdificio = Nome.create(nome1);
        expect(true).to.equal(resultadoNomeEdificio.isSuccess);
    });

    it('Criação de um nome normal sem espaços', () => {
        const resultadoNomeEdificio = Nome.create(nome2);
        expect(true).to.equal(resultadoNomeEdificio.isSuccess);
    });

    it('Criação de um nome com limite de caratéres', () => {
        const resultadoNomeEdificio = Nome.create(nome3);
        expect(true).to.equal(resultadoNomeEdificio.isSuccess);
    });

    //Testes de Nomes Válidos

    it('Criação de um nome sem caratéres', () => {
        const resultadoNomeEdificio = Nome.create(nomeInvalido1);
        expect(false).to.equal(resultadoNomeEdificio.isSuccess);
    });

    it('Criação de um nome com caratéres especiais', () => {
        const resultadoNomeEdificio = Nome.create(nomeInvalido2);
        expect(false).to.equal(resultadoNomeEdificio.isSuccess);
    });

    it('Criação de um nome com caratéres em excesso', () => {
        const resultadoNomeEdificio = Nome.create(nomeInvalido3);
        expect(false).to.equal(resultadoNomeEdificio.isSuccess);
    });
});