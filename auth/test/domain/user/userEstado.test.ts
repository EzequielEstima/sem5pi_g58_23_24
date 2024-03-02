import { expect } from 'chai';
import { it } from 'mocha';
import { UserEstado } from '../../../src/domain/user/userEstado'
describe('Estado do Utilizador', () => {

    it('Criação de um estado aceito com sucesso', () => {
        const estado = UserEstado.create("aceito");
        expect(true).to.equal(estado.isSuccess);
    });
    it('Criação de um estado pendente com sucesso', () => {
        const estado = UserEstado.create("pendente");
        expect(true).to.equal(estado.isSuccess);
    });
    it('Criação de um estado rejeitado com sucesso', () => {
        const estado = UserEstado.create("rejeitado");
        expect(true).to.equal(estado.isSuccess);
    });
    it('Criação de um estado que não é válido', () => {
        const estado = UserEstado.create("dummy");
        const validStates = "[\"aceito\",\"pendente\",\"rejeitado\"]";
        expect("estado não é um dos valores válidos: "+validStates+". Obteve-se: dummy.").to.equal(estado.errorValue());
        expect(true).to.equal(estado.isFailure);
    });
    it ('Criação de um estado null', () => {
        const estado = UserEstado.create(null as unknown as string);
        expect("estado é nulo ou indefinido").to.equal(estado.errorValue());
        expect(true).to.equal(estado.isFailure);
    });
});