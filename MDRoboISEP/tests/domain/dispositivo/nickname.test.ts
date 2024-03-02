import {expect} from 'chai';
import {it} from 'mocha';
import { Nickname} from '../../../src/domain/dispositivo/Nickname';

describe('Nickname de Dispositivo', () => {

    it('Criação de uma nickname sem espaços e com valores alfanumericos tem sucesso', () => {
        const nickname = Nickname.create("Ronaldo12");
        expect(true).to.equal(nickname.isSuccess);
    });

    it('Criação de uma Nickname com espaços não tem sucesso', () => {
    const nickname = Nickname.create("as as");
    expect(true).to.equal(nickname.isFailure);
    });

    it('Criação de uma nickname com mais de 50 caracteres falha', () => {
        const nickname = Nickname.create("qwert".repeat(11));
        expect(true).to.equal(nickname.isFailure);
    });

    it('Criação de um nickname vazio falha', () => {
        const nickname = Nickname.create("");
        expect(true).to.equal(nickname.isFailure);
    });

    it('Criação de uma descricao com caracteres especiais falha', () => {
        const nickname = Nickname.create("ASAS#");
        expect(true).to.equal(nickname.isFailure);
    });

    it('Criação de uma descricao com uma variavel undefined falha', () => {
        let nicknameErro;
        const nickname = Nickname.create(nicknameErro);
        expect(true).to.equal(nickname.isFailure);
    });

});