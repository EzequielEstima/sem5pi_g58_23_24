import { expect } from 'chai';
import { it } from 'mocha';
import { UserName } from '../../../src/domain/user/userName'
describe('Nome do Utilizador', () => {

    it('Criação de um nome com sucesso', () => {
        const nome = UserName.create("dummy");
        expect(true).to.equal(nome.isSuccess);
    });
    it('Criação de um nome inválido', () => {
        const nome = UserName.create("Maaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaarcoo");
        expect("O nome inserido não é um nome válido ou aceite pelo sistema.").to.equal(nome.errorValue());
        expect(true).to.equal(nome.isFailure);
    });
    it('Criação de um nome null', () => {
        const nome = UserName.create(null as unknown as string);
        expect("nome é nulo ou indefinido").to.equal(nome.errorValue());
        expect(true).to.equal(nome.isFailure);
    });
    
});