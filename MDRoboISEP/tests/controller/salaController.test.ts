import { Response, Request, NextFunction } from 'express'; import * as sinon from 'sinon';
import Container from 'typedi';
import IPassagemDTO from '../../src/dto/IPassagemDTO';
import { Result } from '../../src/core/logic/Result';
import SalaController from '../../src/controllers/ImplControllers/SalaController';
import IPassagemService from '../../src/services/IServices/IPassagemService';
import { Codigo } from '../../src/domain/edificio/Codigo';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { Edificio } from '../../src/domain/edificio/Edificio';
import { Nome } from '../../src/domain/edificio/Nome';
import { Elevador } from '../../src/domain/elevador/Elevador';
import { DescricaoPiso } from '../../src/domain/piso/DescricaoPiso';
import { NumeroPiso } from '../../src/domain/piso/NumeroPiso';
import { Piso } from '../../src/domain/piso/Piso';
import { Coordenadas } from '../../src/domain/ponto/Coordenadas';
import { IdPonto } from '../../src/domain/ponto/IdPonto';
import { Ponto } from '../../src/domain/ponto/Ponto';
import { TipoPonto } from '../../src/domain/ponto/TipoPonto';
import { Passagem } from '../../src/domain/passagem/Passagem';
import IEdificioRepo from '../../src/services/IRepos/IEdificioRepo';
import IPassagemRepo from '../../src/services/IRepos/IPassagemRepo';
import { IPassagemPersistence } from '../../src/dataschema/IPassagemPersistence';
import ISalaDTO from '../../src/dto/ISalaDTO';
import ISalaService from '../../src/services/IServices/ISalaService';
import ISalaRepo from '../../src/services/IRepos/ISalaRepo';
import { Sala } from '../../src/domain/sala/Sala';
import { ISalaPersistence } from '../../src/dataschema/ISalaPersistence';
import { Mapa } from '../../src/domain/mapa/Mapa';
import IAuthService from '../../src/services/IServices/IAuthService';
import 'reflect-metadata';


describe('SalaController', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function () {
        this.timeout(300000);
        Container.reset();

        let salaSchemaInstance = require('../../src/persistence/schemas/SalaSchema').default;
        Container.set("SalaSchema", salaSchemaInstance);

        let salaRepoClass = require('../../src/repos/SalaRepo').default;
        let salaRepoInstance = Container.get(salaRepoClass);
        Container.set("SalaRepo", salaRepoInstance);

        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

        let salaServiceClass = require('../../src/services/ImplServices/SalaService').default;
        let salaServiceInstance = Container.get(salaServiceClass);
        Container.set("SalaService", salaServiceInstance);

        let authServiceClass = require('../../src/services/ImplServices/AuthService').default;
        let authServiceInstance = Container.get(authServiceClass);
        Container.set("AuthService", authServiceInstance);
    });
    afterEach(function () {
        sinon.restore();
        sandbox.restore();
    });

    it('Criar sala retorna passagem JSON', async function () {

        let body = {
            id: "B300",
            codigoEdificio: "COD",
            numeroPiso: 1,
            descricao: "Sala B300 - Laboratorio de Informatica",
            categoria: "Laboratorio",
        }

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.spy(),
        };

        let next: Partial<NextFunction> = () => { };
        let salaServiceInstance = Container.get("SalaService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        sinon.stub(salaServiceInstance, 'criarSala').returns(Promise.resolve(Result.ok<ISalaDTO>(body as ISalaDTO)));

        let salaController = new SalaController(salaServiceInstance as ISalaService, authServiceInstance as IAuthService);

        // Act
        await salaController.criarSala(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status, 201);
        sinon.assert.calledWith(res.json, body);
    });

    it('SalaController + SalaService integration test criar sala', async function () {
        // Arrange	
        let body = {
            id: "B300",
            codigoEdificio: "COD",
            numeroPiso: 1,
            descricao: "Sala B300 - Laboratorio de Informatica",
            categoria: "Laboratorio",
        }

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
        };

        let next: Partial<NextFunction> = () => { };

        let metadata = {
            id: "B300",
            codigoEdificio: "COD",
            numeroPiso: 1,
            descricao: "Sala B300 - Laboratorio de Informatica",
            categoria: "Laboratorio",
        }

        let data = await createAllData(metadata.codigoEdificio, metadata.numeroPiso);

        const edificio = data.getValue().edificio

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificio));
        let salaRepo = Container.get("SalaRepo") as ISalaRepo;
        let stubSalaRepo = sinon.stub(salaRepo, 'findByDomainId');
        stubSalaRepo.onCall(0).returns(null);
        let stubRepo2 = sinon.stub(salaRepo, 'save');
        stubRepo2.onCall(0).returns(Promise.resolve(Sala));
       
        let salaServiceInstance = Container.get("SalaService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        const salaServiceSpy = sinon.spy(salaServiceInstance, 'criarSala');

        const salaController = new SalaController(salaServiceInstance as ISalaService, authServiceInstance as IAuthService);

        // Act
        await salaController.criarSala(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(salaServiceSpy);
        sinon.assert.calledWith(salaServiceSpy, body as ISalaDTO);

    });

    /*it('SalaController + SalaService + SalaRepo integração test criar sala devolve sala', async function () {
        // Arrange	
        let body = {
            id: "B300",
            codigoEdificio: "COD",
            numeroPiso: 1,
            descricao: "Sala B300 - Laboratorio de Informatica",
            categoria: "Laboratorio",
        }

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
        };

        let next: Partial<NextFunction> = () => { };

        let metadata = {
            id: "B300",
            codigoEdificio: "COD",
            numeroPiso: 1,
            descricao: "Sala B300 - Laboratorio de Informatica",
            categoria: "Laboratorio",
        }

        let data = await createAllData(metadata.codigoEdificio, metadata.numeroPiso);

        const edificio = data.getValue().edificio

        const listaPontos = data.getValue().listaPontos;

        let salaPersistence = {
            domainID: "B300",
            categoria: "Laboratorio",
            descricao: "Sala B300 - Laboratorio de Informatica",
            listaPontos: listaPontos,
            piso: 1,
        } as unknown as ISalaPersistence;


        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificio));

        const passagemSchemaInstance = Container.get("SalaSchema");
        sinon.stub(passagemSchemaInstance, "findOne").returns(null);
        sinon.stub(passagemSchemaInstance, "create").returns(salaPersistence as ISalaPersistence);

        let salaServiceInstance = Container.get("SalaService");
        const salaServiceSpy = sinon.spy(salaServiceInstance, 'criarSala');

        const salaController = new SalaController(salaServiceInstance as ISalaService);

        await salaController.criarSala(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(salaServiceSpy);
        sinon.assert.calledWith(salaServiceSpy, body as ISalaDTO);

    });*/

}); 

function createAllData(codigoEdificioA: string, numeroPisoA: number): Promise<Result<any>> {

    // definir props
    interface edificioPropsA {
        nome?: Nome;
        dimensao: Dimensao;
        descricao?: DescricaoEdificio;
        listaPisos: Piso[];
        elevador?: Elevador;
    }
    interface pisoProps {
        numeroPiso: NumeroPiso;
        descricaoPiso: DescricaoPiso;
        mapa: Mapa;
    }

    // criar props edificios
    let edificioPropsA: edificioPropsA = {
        nome: Nome.create("DEI").getValue(),
        dimensao: Dimensao.create(3, 3).getValue(),
        descricao: DescricaoEdificio.create("DEI").getValue(),
        listaPisos: [],
    }

    // criar codigos edificios
    let codigoEdificio = Codigo.create(codigoEdificioA).getValue();

    // criar edificios
    let edificioA = Edificio.create(edificioPropsA, codigoEdificio).getValue();

    // criar mapa
    let mapa;

    // criar props pisos
    let pisoPropsA: pisoProps = {
        numeroPiso: NumeroPiso.create(numeroPisoA).getValue(),
        descricaoPiso: DescricaoPiso.create("Piso 1").getValue(),
        mapa: mapa,
    }

    // criar pisos
    let pisoA = Piso.create(pisoPropsA).getValue();

    // adicionar pisos aos edificios
    edificioA.addPiso(pisoA);

    if (edificioA == null || pisoA == null) {
        return Promise.resolve(Result.fail<void>("Erro ao criar dados de test"));
    }

    return Promise.resolve(Result.ok<any>({
        "edificio": edificioA,
    }));

}