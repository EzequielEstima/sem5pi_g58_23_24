import { expect } from 'chai';
import { it } from 'mocha';
import { Role } from '../../../src/domain/user/role'
describe('Role do Utilizador', () => {

    it('Criação de um role utente com sucesso', () => {
        const role = Role.create("utente")
        expect(true).to.equal(role.isSuccess);
    });
    it('Criação de um role admin com sucesso', () => {
        const role = Role.create("admin")
        expect(true).to.equal(role.isSuccess);
    });
    it('Criação de um role gestor de campus com sucesso', () => {
        const role = Role.create("gestor de campus")
        expect(true).to.equal(role.isSuccess);
    });
    it('Criação de um role gestor de frota com sucesso', () => {
        const role = Role.create("gestor de frota")
        expect(true).to.equal(role.isSuccess);
    });
    it('Criação de um role gestor de tarefas com sucesso', () => {
        const role = Role.create("gestor de tarefas")
        expect(true).to.equal(role.isSuccess);
    });
    it('Criação de um role não existente', () => {
        const role = Role.create("XD")
        const validRoles = "[\"gestor de campus\",\"gestor de frota\",\"gestor de tarefas\",\"utente\",\"admin\"]";
        expect("role não é um dos valores válidos: "+validRoles+". Obteve-se: XD.").to.equal(role.errorValue());
        expect(true).to.equal(role.isFailure);
    });
    it('Criação de um role null', () => {
        const role = Role.create(null as unknown as string)
        expect("role é nulo ou indefinido").to.equal(role.errorValue());
        expect(true).to.equal(role.isFailure);
    });

});