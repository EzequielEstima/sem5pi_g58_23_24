import { expect } from 'chai';
import { it } from 'mocha';
import { UserTelefone } from '../../../src/domain/user/userTelefone'
describe('Telefone do Utilizador', () => {

    it('Criação de um telefone com sucesso', () => {
        const telefone = UserTelefone.create("916969696");
        expect(true).to.equal(telefone.isSuccess);
    } );
    it('Criação de um telefone inválido', () => {
        const telefone = UserTelefone.create("123456789");
        expect("O numero de telefone não tem um formato portugues valido.").to.equal(telefone.errorValue());
        expect(true).to.equal(telefone.isFailure);
    });
});