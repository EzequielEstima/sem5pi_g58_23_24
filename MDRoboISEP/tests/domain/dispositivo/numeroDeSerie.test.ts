import {expect} from 'chai';
import {it} from 'mocha';
import { NumeroDeSerie} from '../../../src/domain/dispositivo/NumeroDeSerie';

describe('numeroSerie de Dispositivo', () => {

    it('Criação de uma numeroSerie sem espaços e com valores alfanumericos tem sucesso', () => {
        const numeroSerie = NumeroDeSerie.create("Ronaldo12");
        expect(true).to.equal(numeroSerie.isSuccess);
    });

    it('Criação de uma numeroSerie com espaços não tem sucesso', () => {
    const numeroSerie = NumeroDeSerie.create("as as");
    expect(true).to.equal(numeroSerie.isFailure);
    });

    it('Criação de uma numeroSerie com mais de 50 caracteres falha', () => {
        const numeroSerie = NumeroDeSerie.create("qwert".repeat(11));
        expect(true).to.equal(numeroSerie.isFailure);
    });

    it('Criação de um numeroSerie vazio falha', () => {
        const numeroSerie = NumeroDeSerie.create("");
        expect(true).to.equal(numeroSerie.isFailure);
    });

    it('Criação de uma descricao com caracteres especiais falha', () => {
        const numeroSerie = NumeroDeSerie.create("ASAS#");
        expect(true).to.equal(numeroSerie.isFailure);
    });

    it('Criação de uma descricao com uma variavel undefined falha', () => {
        let numeroSerieErro;
        const numeroSerie = NumeroDeSerie.create(numeroSerieErro);
        expect(true).to.equal(numeroSerie.isFailure);
    });

});