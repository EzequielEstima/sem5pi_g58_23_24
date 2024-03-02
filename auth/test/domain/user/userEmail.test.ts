import { expect } from 'chai';
import { it } from 'mocha';
import { UserEmail } from '../../../src/domain/user/userEmail'
describe('Email do Utilizador', () => {

    it('Criação de um email com sucesso', () => {
        const email = UserEmail.create("dummy@isep.ipp.pt");
        expect(true).to.equal(email.isSuccess);
    });
    it('Criação de um email que não pertence a um dominio aceite pelo sistema', () => {
        const email = UserEmail.create("dummy@gmail.com");
        expect("O dominio não é um válido ou aceite pelo sistema.").to.equal(email.errorValue());
        expect(true).to.equal(email.isFailure);
    });
    it ('Criação de um email com um formato inválido', () => {
        const email = UserEmail.create("dummy@isep");
        expect("O email não é um email válido").to.equal(email.errorValue());
        expect(true).to.equal(email.isFailure);
    });
    it ('Criação de um email nulo', () => {
        const email = UserEmail.create(undefined as unknown as string);
        expect("email é nulo ou indefinido").to.equal(email.errorValue());
        expect(true).to.equal(email.isFailure);
    });
    
});