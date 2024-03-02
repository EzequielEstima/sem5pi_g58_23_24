import {expect} from 'chai';
import {it} from 'mocha';
import { DescricaoDispositivo} from '../../../src/domain/dispositivo/DescricaoDispositivo';

describe('Descricao de Dispositivo', () => {
    

    it('Criação de uma descricao com espaços tem sucesso', () => {
    const descricaoDispositivo = DescricaoDispositivo.create("Ola sou lindo 1");
    expect(true).to.equal(descricaoDispositivo.isSuccess);
    });

    it('Criação de uma descricao sem espaços e com valores alfanumericos tem sucesso', () => {
        const descricaoDispositivo2 = DescricaoDispositivo.create("Ronaldo12");
        expect(true).to.equal(descricaoDispositivo2.isSuccess);
    });

    it('Criação de uma descricao com mais de 250 caracteres falha', () => {
        const descricaoDispositivo3 = DescricaoDispositivo.create("qwer".repeat(64));
        expect(true).to.equal(descricaoDispositivo3.isFailure);
    });

    it('Criação de uma descricao vazia falha', () => {
        const descricaoDispositivo1 = DescricaoDispositivo.create("");
        expect(true).to.equal(descricaoDispositivo1.isFailure);
    });

    it('Criação de uma descricao com caracteres especiais falha', () => {
        const descricaoDispositivo2 = DescricaoDispositivo.create("ASAS #");
        expect(true).to.equal(descricaoDispositivo2.isFailure);
    });

    it('Criação de uma descricao com uma variavel undefined falha', () => {
        let descricaoErro;
        const descricaoDispositivo2 = DescricaoDispositivo.create(descricaoErro);
        expect(true).to.equal(descricaoDispositivo2.isFailure);
    });

});