import {expect} from 'chai';
import {it} from 'mocha';
import { DescricaoEdificio} from '../../../src/domain/edificio/DescricaoEdificio';

describe('teste do descricao de edificio', () => {
    //Valores válidos para criação de uma descricao
    let descricao = 'Edificio A';
    let descricao2 = 'EdificioB';
    let descricao3 = '';
    for(let i = 0; i < 255; i++){
        descricao3 += 'a';
    }
    //Valores inválidos para criação de uma descricao
    let descricaoInvalida1 = '';
    let descricaoInvalida2 = '****_*';
    let descricaoInvalida3 = '';
    for(let i = 0; i < 256; i++){
        descricaoInvalida3 += 'a';
    }
    //Testes de Descricao Válidos

    it('Criação de uma descricao normal com espaços', () => {
    const resultadoDescricaoEdificio = DescricaoEdificio.create(descricao);
    expect(true).to.equal(resultadoDescricaoEdificio.isSuccess);
    });

    it('Criação de uma descricao normal sem espaços', () => {
        const resultadoDescricaoEdificio2 = DescricaoEdificio.create(descricao2);
        expect(true).to.equal(resultadoDescricaoEdificio2.isSuccess);
    });

    it('Criação de uma descricao com limite de caratéres', () => {
        const resultadoDescricaoEdificio3 = DescricaoEdificio.create(descricao3);
        expect(true).to.equal(resultadoDescricaoEdificio3.isSuccess);
    });


    //Testes de Descricao Inválidos

    it('Criação de uma descricao sem caratéres', () => {
        const resultadoDescricaoEdificio1 = DescricaoEdificio.create(descricaoInvalida1);
        expect(false).to.equal(resultadoDescricaoEdificio1.isSuccess);
    });

    it('Criação de uma descricao com caratéres especiais', () => {
        const resultadoDescricaoEdificio2 = DescricaoEdificio.create(descricaoInvalida2);
        expect(false).to.equal(resultadoDescricaoEdificio2.isSuccess);
    });

    it('Criação de uma descricao com caratéres em excesso', () => {
        const resultadoDescricaoEdificio3 = DescricaoEdificio.create(descricaoInvalida3);
        expect(false).to.equal(resultadoDescricaoEdificio3.isSuccess);
    });
});