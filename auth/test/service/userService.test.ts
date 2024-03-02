import { expect } from "chai";
import 'mocha';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { UserPassword } from '../../src/domain/user/userPassword';
import { UserEmail } from '../../src/domain/user/userEmail';
import { Role } from '../../src/domain/user/role';
import { User } from '../../src/domain/user/user';
import { UserEstado } from '../../src/domain/user/userEstado';
import { UserNumeroContribuinte } from '../../src/domain/user/userNumeroContribuinte';
import { UserName } from '../../src/domain/user/userName';
import { UserTelefone } from '../../src/domain/user/userTelefone';
import { ISignupUtenteDTO } from '../../src/dto/ISignupUtenteDTO';
import UserService from '../../src/services/ImplServices/userService';
import IUserRepo from '../../src/services/IRepos/IUserRepo';


import "reflect-metadata";

import 'mocha';
import { IUserDTO } from "../../src/dto/IUserDTO";
import { IApproveOrRejectSignUpDTO } from "../../src/dto/IApproveOrRejectUtenteDTO";
import { IUpdateUserDTO } from "../../src/dto/IUpdateUserDTO";
import { IDadosPessoaisDTO } from "../../src/dto/IDadosPessoaisDTO";

describe('User Service ', () => {

    const sandbox = sinon.createSandbox();

    beforeEach(function () {
        Container.reset();
        this.timeout(10000);
        let dispositivoSchemaInstance = require('../../src/persistence/schemas/userSchema').default;
        Container.set("userSchema", dispositivoSchemaInstance);

        let userRepoClass = require('../../src/repos/userRepo').default;
        let userRepoInstance = Container.get(userRepoClass);
        Container.set("UserRepo", userRepoInstance);

    });

    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('signup com sucesso', async () => {

        let body = {
            "name": "Marco Antonio",
            "email": "marco@isep.ipp.pt",
            "telefone": "914231321",
            "nif": "321123567",
            "password": "Password10@",
            "estado": "aceito",
            "role": "admin"
        };



        const hashedPassword = await UserPassword.create({ value: body.password })
        let userProps = {
            name: UserName.create(body.name).getValue(),
            telefone: UserTelefone.create(body.telefone).getValue(),
            nif: UserNumeroContribuinte.create(body.nif).getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("admin").getValue(),
            estado: UserEstado.create("aceito").getValue()
        };
        let user = User.create(userProps, UserEmail.create(body.email).getValue());
        let userRepoInstance = Container.get("UserRepo");
        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(null));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user));
        const tipoDispositivoService = new UserService(userRepoInstance as IUserRepo);
        let answer = await tipoDispositivoService.SignUp(body as IUserDTO);
        expect("Conta criada com sucesso!").to.equal(answer.getValue());
    });


    it('signup falha porque o email já existe', async () => {

        let body = {
            "name": "Marco Antonio",
            "email": "marco@isep.ipp.pt",
            "telefone": "914231321",
            "nif": "321123567",
            "password": "Password10@",
            "estado": "aceito",
            "role": "admin"
        };



        const hashedPassword = await UserPassword.create({ value: body.password })
        let userProps = {
            name: UserName.create(body.name).getValue(),
            telefone: UserTelefone.create(body.telefone).getValue(),
            nif: UserNumeroContribuinte.create(body.nif).getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("admin").getValue(),
            estado: UserEstado.create("aceito").getValue()
        };
        let user = User.create(userProps, UserEmail.create(body.email).getValue());
        let userRepoInstance = Container.get("UserRepo");
        sinon.stub(userRepoInstance, "findByEmail").returns(user);
        const tipoDispositivoService = new UserService(userRepoInstance as IUserRepo);
        let answer = await tipoDispositivoService.SignUp(body as IUserDTO);
        expect("Utilizador já existe com email marco@isep.ipp.pt").to.equal(answer.errorValue());
    });


    it('signupUtente com sucesso', async () => {

        let body = {
            name: "Marco Antonio",
            email: "Marcoantonio@isep.ipp.pt",
            telefone: "914231321",
            nif: "321123567",
            password: "Password10@"
        };

        const hashedPassword = await UserPassword.create({ value: body.password })

        let userProps = {
            name: UserName.create(body.name).getValue(),
            telefone: UserTelefone.create(body.telefone).getValue(),
            nif: UserNumeroContribuinte.create(body.nif).getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        };
        let user = User.create(userProps, UserEmail.create(body.email).getValue());

        let userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(null));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user));

        const tipoDispositivoService = new UserService(userRepoInstance as IUserRepo);

        let answer = await tipoDispositivoService.signupUtente(body as ISignupUtenteDTO);
        expect("Conta criada com sucesso!").to.equal(answer.getValue());

    });

    it('signupUtente falha porque o email já existe', async () => {

        let body = {
            name: "Marco Antonio",
            email: "Marcoantonio@isep.ipp.pt",
            telefone: "914231321",
            nif: "321123567",
            password: "Password10@"
        };

        const hashedPassword = await UserPassword.create({ value: body.password })

        let userProps = {
            name: UserName.create(body.name).getValue(),
            telefone: UserTelefone.create(body.telefone).getValue(),
            nif: UserNumeroContribuinte.create(body.nif).getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        };
        let user = User.create(userProps, UserEmail.create(body.email).getValue());

        let userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(user));

        const tipoDispositivoService = new UserService(userRepoInstance as IUserRepo);

        let answer = await tipoDispositivoService.signupUtente(body as ISignupUtenteDTO);
        expect("Já existe um utilizador com esse email").to.equal(answer.errorValue());

    });

    it ('approveOrRejectSignUp com sucesso caso aceito', async () => {
        
        let body = {
            email: "marco@isep.ipp.pt",
            estado : "aceito"
        };
       
        const hashedPassword = await UserPassword.create({ value: "Password10@" })

        const userRepoInstance = Container.get("UserRepo");
       
        const user = User.create({
            name: UserName.create("Marco Antonio").getValue(),
            telefone: UserTelefone.create("914231321").getValue(),
            nif: UserNumeroContribuinte.create("321123567").getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        }, UserEmail.create(body.email).getValue());

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(user.getValue()));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user.getValue()));
        
        const service = new UserService(userRepoInstance as IUserRepo);
        const answer = await service.approveOrRejectSignUp(body as IApproveOrRejectSignUpDTO);

        expect(answer.getValue()).to.equal("Estado do utilizador alterado com sucesso!");
    });

    it ('approveOrRejectSignUp com sucesso caso rejeitado', async () => {
        let body = {
            email: "marco@isep.ipp.pt",
            estado : "rejeitado"
        };
       
        const hashedPassword = await UserPassword.create({ value: "Password10@" })

        const userRepoInstance = Container.get("UserRepo");
       
        const user = User.create({
            name: UserName.create("Marco Antonio").getValue(),
            telefone: UserTelefone.create("914231321").getValue(),
            nif: UserNumeroContribuinte.create("321123567").getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        }, UserEmail.create(body.email).getValue());

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(user.getValue()));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user.getValue()));
        
        const service = new UserService(userRepoInstance as IUserRepo);
        const answer = await service.approveOrRejectSignUp(body as IApproveOrRejectSignUpDTO);

        expect(answer.getValue()).to.equal("Estado do utilizador alterado com sucesso!");
    });

    it ('approveOrRejectSignUp falha porque o email não existe', async () => {
        let body = {
            email: "marco@isep.ipp.pt",
            estado : "aceito"
        };
       
        const hashedPassword = await UserPassword.create({ value: "Password10@" })

        const userRepoInstance = Container.get("UserRepo");
       
        const user = User.create({
            name: UserName.create("Marco Antonio").getValue(),
            telefone: UserTelefone.create("914231321").getValue(),
            nif: UserNumeroContribuinte.create("321123567").getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        }, UserEmail.create(body.email).getValue());

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(null));
        
        const service = new UserService(userRepoInstance as IUserRepo);
        const answer = await service.approveOrRejectSignUp(body as IApproveOrRejectSignUpDTO);

        expect(answer.errorValue()).to.equal("Utilizador não existe com email " + user.getValue().getEmail());
    });

    it ('approveOrRejectSignUp falha porque o estado não é válido', async () => {
        let body = {
            email: "marco@isep.ipp.pt",
            estado : "morto"
        };
       
        const hashedPassword = await UserPassword.create({ value: "Password10@" })

        const userRepoInstance = Container.get("UserRepo");
       
        const user = User.create({
            name: UserName.create("Marco Antonio").getValue(),
            telefone: UserTelefone.create("914231321").getValue(),
            nif: UserNumeroContribuinte.create("321123567").getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        }, UserEmail.create(body.email).getValue());

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(user.getValue()));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user.getValue()));
        
        const service = new UserService(userRepoInstance as IUserRepo);
        const answer = await service.approveOrRejectSignUp(body as IApproveOrRejectSignUpDTO);

        expect(answer.errorValue()).to.equal("Estado inválido");
    });

    it ('alterarDadosUser tem sucesso ', async () => {
        let updateDTO = {
            email: "marco@isep.ipp.pt",
            nif: "999999999",
            telefone: "918765432",
            nome : "Nome1"
        };
       
        const hashedPassword = await UserPassword.create({ value: "Password10@" })

        const userRepoInstance = Container.get("UserRepo");
       
        const user = User.create({
            name: UserName.create("Marco Antonio").getValue(),
            telefone: UserTelefone.create("914231321").getValue(),
            nif: UserNumeroContribuinte.create("321123567").getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        }, UserEmail.create("marco@isep.ipp.pt").getValue());

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(user.getValue()));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user.getValue()));
        
        const service = new UserService(userRepoInstance as IUserRepo);
        const answer = await service.alterarDadosUser(updateDTO as IUpdateUserDTO);

        expect(answer.getValue()).to.equal(updateDTO);
    });

    it ('alterarDadosUser falha quando o user não existe', async () => {
        let updateDTO = {
            email: "marco@isep.ipp.pt",
            nif: "999999999",
            telefone: "918765432",
            nome : "Nome1"
        };
       
        const hashedPassword = await UserPassword.create({ value: "Password10@" })

        const userRepoInstance = Container.get("UserRepo");
       
        const user = User.create({
            name: UserName.create("Marco Antonio").getValue(),
            telefone: UserTelefone.create("914231321").getValue(),
            nif: UserNumeroContribuinte.create("321123567").getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        }, UserEmail.create("marco@isep.ipp.pt").getValue());

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(null));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user.getValue()));
        
        const service = new UserService(userRepoInstance as IUserRepo);
        const answer = await service.alterarDadosUser(updateDTO as IUpdateUserDTO);

        expect(answer.errorValue()).to.equal("Não existe um utilizador com este email");
    });

    it ('alterarDadosUser falha quando o nif novo não é válido', async () => {
        let updateDTO = {
            email: "marco@isep.ipp.pt",
            nif: "nif",
            telefone: "918765432",
            nome : "Nome1"
        };
       
        const hashedPassword = await UserPassword.create({ value: "Password10@" })

        const userRepoInstance = Container.get("UserRepo");
       
        const user = User.create({
            name: UserName.create("Marco Antonio").getValue(),
            telefone: UserTelefone.create("914231321").getValue(),
            nif: UserNumeroContribuinte.create("321123567").getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        }, UserEmail.create("marco@isep.ipp.pt").getValue());

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(user.getValue()));
        sinon.stub(userRepoInstance, "save").returns(Promise.resolve(user.getValue()));
        
        const service = new UserService(userRepoInstance as IUserRepo);
        const answer = await service.alterarDadosUser(updateDTO as IUpdateUserDTO);

        expect(answer.errorValue()).to.equal("O numero de contribuinte tem que ter 9 digitos.");
    });

    it ('DeleteUtente tem sucesso ', async () => {
        let email = "default@isep.ipp.pt";
       
        const hashedPassword = await UserPassword.create({ value: "Password10@" })

        const userRepoInstance = Container.get("UserRepo");
       
        const user = User.create({
            name: UserName.create("Marco Antonio").getValue(),
            telefone: UserTelefone.create("914231321").getValue(),
            nif: UserNumeroContribuinte.create("321123567").getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        }, UserEmail.create("default@isep.ipp.pt").getValue());

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(user.getValue()));
        sinon.stub(userRepoInstance, "delete").returns(Promise.resolve(true));
        
        const service = new UserService(userRepoInstance as IUserRepo);
        const answer = await service.deleteUtente(email);

        expect(answer.getValue()).to.equal("Utilizador removido com sucesso");

    });

    it ('DeleteUtente falha se o user não existir ', async () => {
        let email = "default@isep.ipp.pt";
       
        const userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(null));
        
        const service = new UserService(userRepoInstance as IUserRepo);
        const answer = await service.deleteUtente(email);

        expect(answer.errorValue()).to.equal("Utilizador não existe");

    });

    it ('DeleteUtente falha se delete falhar ', async () => {
        let email = "default@isep.ipp.pt";
       
        const hashedPassword = await UserPassword.create({ value: "Password10@" })

        const userRepoInstance = Container.get("UserRepo");
       
        const user = User.create({
            name: UserName.create("Marco Antonio").getValue(),
            telefone: UserTelefone.create("914231321").getValue(),
            nif: UserNumeroContribuinte.create("321123567").getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        }, UserEmail.create("default@isep.ipp.pt").getValue());

        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(user.getValue()));
        sinon.stub(userRepoInstance, "delete").returns(Promise.resolve(false));
        
        const service = new UserService(userRepoInstance as IUserRepo);
        const answer = await service.deleteUtente(email);


        expect(answer.errorValue()).to.equal("Não foi possivel remover o utilizador");

    });

    it ('copiaDadosPessoais tem sucesso se utilizador existir', async () => {
        const userRepoInstance = Container.get("UserRepo");
        let email = "marco@isep.ipp.pt";
        let userDTO = {
            name: "Marco Antonio",
            email: email,
            telefone: "914231321",
            nif: "321123567"
        } as IDadosPessoaisDTO;
        let nif : string = "";
        if( userDTO.nif != undefined){
            nif = userDTO.nif;
        }
        const hashedPassword = await UserPassword.create({ value: "Password10@" })
        const user = User.create({
            name: UserName.create(userDTO.name).getValue(),
            telefone: UserTelefone.create(userDTO.telefone).getValue(),
            nif: UserNumeroContribuinte.create(nif).getValue(),
            password: hashedPassword.getValue(),
            role: Role.create("utente").getValue(),
            estado: UserEstado.create("pendente").getValue()
        }, UserEmail.create(email).getValue());
        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(user.getValue()));
        const service = new UserService(userRepoInstance as IUserRepo);
        const answer = await service.copiaDadosPessoais(email);
        expect(answer.getValue()).to.deep.equal(userDTO);
    });

    it ('copiaDadosPessoais falha se utilizador não existir', async () => {
        const userRepoInstance = Container.get("UserRepo");
        let email = "marco@isep.ipp.pt";
        sinon.stub(userRepoInstance, "findByEmail").returns(Promise.resolve(null));
        const service = new UserService(userRepoInstance as IUserRepo);
        const answer = await service.copiaDadosPessoais(email);
        expect(answer.errorValue()).to.equal("Não existe um utilizador com este email");
    });
});