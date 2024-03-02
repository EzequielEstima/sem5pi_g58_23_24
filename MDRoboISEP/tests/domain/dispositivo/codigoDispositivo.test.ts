import {expect} from 'chai';
import {it} from 'mocha';
import { CodigoDispositivo } from '../../../src/domain/dispositivo/CodigoDispositivo';

describe('Codigo Dispositivo', () => {


    it('Criação de um código com sucesso', () => {
        const codigo = CodigoDispositivo.create("AS12");
        expect(true).to.equal(codigo.isSuccess);
    });

    it('Criação de um código com espaços falha', () => {
        const codigo = CodigoDispositivo.create("codi go2");
        expect(true).to.equal(codigo.isFailure);
    });

    it('Criação de um código com mais de 30 caracteres falha', () => {
        const codigo = CodigoDispositivo.create("12345678901234567890123456789012");
        expect(true).to.equal(codigo.isFailure);
    });

    it('Criação de um código com uma string vazia falha', () => {
        const codigo = CodigoDispositivo.create("");
        expect(true).to.equal(codigo.isFailure);
    });

    it('Criação de um código com caracteres especiais falha', () => {
        const codigo = CodigoDispositivo.create("AS12#");
        expect(true).to.equal(codigo.isFailure);
    });

    it('Criação de um código com uma variavel undefined falha', () => {
        let codigoErro;
        const codigo = CodigoDispositivo.create(codigoErro);
        expect(true).to.equal(codigo.isFailure);
    });
});