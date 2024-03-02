import { expect } from 'chai';
import { it } from 'mocha';
import { UserPassword } from '../../../src/domain/user/userPassword'
describe('Password do Utilizador', () => {

    it('Criação de uma password com sucesso', async () => {
        const password = await UserPassword.create({value: "Password10@"});
        expect(true).to.equal(password.isSuccess);
    });
    it('Criação de uma password inválida, menor que 10 carateres', async () => {
        const password = await UserPassword.create({value: "Passwor1@"});
        expect("A password tem que ter 10 ou mais caracteres").to.equal(password.errorValue());
        expect(true).to.equal(password.isFailure);
    });
    it('Criação de uma password inválida, não contém maisculas', async () => {
        const password = await UserPassword.create({value: "password10@"});
        expect("A password tem que ter pelo menos uma letra maiúscula").to.equal(password.errorValue());
        expect(true).to.equal(password.isFailure);
    });
    it('Criação de uma password inválida, não contém minusculas', async () => {
        const password = await UserPassword.create({value: "PASSWORD10@"});
        expect("A password tem que ter pelo menos uma letra minúscula").to.equal(password.errorValue());
        expect(true).to.equal(password.isFailure);
    });
    it('Criação de uma password inválida, não contém digitos', async () => {
        const password = await UserPassword.create({value: "Passworddd@"});
        expect("A password tem que ter pelo menos um número").to.equal(password.errorValue());
        expect(true).to.equal(password.isFailure);
    });
    it('Criação de uma password inválida, não contém simbolos', async () => {
        const password = await UserPassword.create({value: "Password100"});
        expect("A password tem que ter pelo menos um símbolo ou caracter especial").to.equal(password.errorValue());
        expect(true).to.equal(password.isFailure);
    });
    /*it('Criação de uma password null', async () => {
        const password = await UserPassword.create({value: null as unknown as string});
        expect("password é nulo ou indefinido").to.equal(password.errorValue());
        expect(true).to.equal(password.isFailure);
    });*/
});