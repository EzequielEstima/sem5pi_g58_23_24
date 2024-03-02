import { UserEmail } from '../../../src/domain/user/userEmail'
import { UserNumeroContribuinte } from '../../../src/domain/user/userNumeroContribuinte'
import { UserTelefone } from '../../../src/domain/user/userTelefone'
import { UserPassword } from '../../../src/domain/user/userPassword'
import { UserName } from '../../../src/domain/user/userName'
import { UserEstado } from '../../../src/domain/user/userEstado'
import { Role } from '../../../src/domain/user/role'
import { User } from '../../../src/domain/user/user'
import { expect } from 'chai';
import { it } from 'mocha';

describe('User', () => {

    it('Update nome tem sucesso', async () => {
        const email = UserEmail.create("eskama@isep.ipp.pt");
        const nif = UserNumeroContribuinte.create("123456789");
        const telefone = UserTelefone.create("912345678");
        const password = await UserPassword.create({value: "Password10@"});
        const name = UserName.create("Eskama");
        const estado = UserEstado.create("pendente");
        const role = Role.create("utente");

        const userProps = {
            name: name.getValue(),
            telefone: telefone.getValue(),
            nif: nif.getValue(),
            password: password.getValue(),
            estado: estado.getValue(),
            role: role.getValue()
        }

        const user = User.create(userProps, email.getValue()).getValue();

        expect(user.getName().getValue()).to.equal("Eskama");

        const novoUsername = UserName.create("NovoEskama").getValue()

        user.updateName(novoUsername);

        expect(user.getName().getValue()).to.equal("NovoEskama");
    });

    it('Update nif tem sucesso', async () => {
        const email = UserEmail.create("eskama@isep.ipp.pt");
        const nif = UserNumeroContribuinte.create("123456789");
        const telefone = UserTelefone.create("912345678");
        const password = await UserPassword.create({value: "Password10@"});
        const name = UserName.create("Eskama");
        const estado = UserEstado.create("pendente");
        const role = Role.create("utente");

        const userProps = {
            name: name.getValue(),
            telefone: telefone.getValue(),
            nif: nif.getValue(),
            password: password.getValue(),
            estado: estado.getValue(),
            role: role.getValue()
        }

        const user = User.create(userProps, email.getValue()).getValue();

        expect(user.getNif().getValue()).to.equal("123456789");

        const novoNif = UserNumeroContribuinte.create("987654321").getValue()

        user.updateNif(novoNif);

        expect(user.getNif().getValue()).to.equal("987654321");
    });

    it('Criação de um email com sucesso', async () => {
        const email = UserEmail.create("eskama@isep.ipp.pt");
        const nif = UserNumeroContribuinte.create("123456789");
        const telefone = UserTelefone.create("912345678");
        const password = await UserPassword.create({value: "Password10@"});
        const name = UserName.create("Eskama");
        const estado = UserEstado.create("pendente");
        const role = Role.create("utente");

        const userProps = {
            name: name.getValue(),
            telefone: telefone.getValue(),
            nif: nif.getValue(),
            password: password.getValue(),
            estado: estado.getValue(),
            role: role.getValue()
        }

        const user = User.create(userProps, email.getValue()).getValue();

        expect(user.getTelefone().getValue()).to.equal("912345678");

        const novoTel = UserTelefone.create("912345679").getValue()

        user.updateTelefone(novoTel);

        expect(user.getTelefone().getValue()).to.equal("912345679");
    });
    
    
});