import { Response, Request, NextFunction } from 'express'; import * as sinon from 'sinon';
import Container from 'typedi';
import IPassagemDTO from '../../src/dto/IPassagemDTO';
import { Result } from '../../src/core/logic/Result';
import PassagemController from '../../src/controllers/ImplControllers/PassagemController';
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
import { Passagem } from '../../src/domain/passagem/Passagem';
import IEdificioRepo from '../../src/services/IRepos/IEdificioRepo';
import IPassagemRepo from '../../src/services/IRepos/IPassagemRepo';
import { IPassagemPersistence } from '../../src/dataschema/IPassagemPersistence';
import IListarPassagemDTO from '../../src/dto/IListarPassagemDTO';
import { IdPiso } from '../../src/domain/piso/IdPiso';
import { Mapa } from '../../src/domain/mapa/Mapa';
import { IdPassagem } from '../../src/domain/passagem/IdPassagem';
import IAuthService from '../../src/services/IServices/IAuthService';
import 'reflect-metadata';


describe('PassagemController', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function () {
        this.timeout(300000);
        Container.reset();
        let mapa;
        // Criar 2 pisos
        let piso1 = Piso.create({
            numeroPiso:  NumeroPiso.create(1).getValue(),
            descricaoPiso: DescricaoPiso.create("Ola").getValue(),
            mapa: mapa,
        }, IdPiso.create(1).getValue()).getValue();
        
        let piso2 = Piso.create({
            numeroPiso:  NumeroPiso.create(1).getValue(),
            descricaoPiso: DescricaoPiso.create("Ola").getValue(),
            mapa: mapa,
        }, IdPiso.create(2).getValue()).getValue();
        
        let passagem = Passagem.create({
            pisoA: piso1,
            pisoB: piso2,
        }, IdPassagem.create(1).getValue()).getValue();
        
        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

        let pisoSchemaInstance = require('../../src/persistence/schemas/PisoSchema').default;
        Container.set("PisoSchema", pisoSchemaInstance);

        Container.set("Piso1", piso1);
        Container.set("Piso2", piso2);

        Container.set("Passagem", passagem);

        let passagemSchemaInstance = require('../../src/persistence/schemas/PassagemSchema').default;
        Container.set("PassagemSchema", passagemSchemaInstance);

        let passagemRepoClass = require('../../src/repos/PassagemRepo').default;
        let passagemRepoInstance = Container.get(passagemRepoClass);
        Container.set("PassagemRepo", passagemRepoInstance);

        let passagemServiceClass = require('../../src/services/ImplServices/PassagemService').default;
        let passagemServiceInstance = Container.get(passagemServiceClass);
        Container.set("PassagemService", passagemServiceInstance);

        let authServiceClass = require('../../src/services/ImplServices/AuthService').default;
        let authServiceInstance = Container.get(authServiceClass);
        Container.set("AuthService", authServiceInstance);


        let pisoRepoClass = require('../../src/repos/PisoRepo').default;
        let pisoRepoInstance = Container.get(pisoRepoClass);
        Container.set("PisoRepo", pisoRepoInstance);
    });
    afterEach(function () {
        sinon.restore();
        sandbox.restore();
    });

    it('Criar passagem retorna passagem JSON', async function () {

        let body = {
            "id": 1,
            "codigoEdificioA": "COD1",
            "codigoEdificioB": "COD2",
            "numeroPisoA": 1,
            "numeroPisoB": 2,
        };

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.spy(),
        };

        let next: Partial<NextFunction> = () => { };
        let passagemServiceInstance = Container.get("PassagemService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        sinon.stub(passagemServiceInstance, 'criarPassagem').returns(Promise.resolve(Result.ok<IPassagemDTO>(body as IPassagemDTO)));

        let passagemController = new PassagemController(passagemServiceInstance as IPassagemService, authServiceInstance as IAuthService);
        

        // Act
        await passagemController.criarPassagem(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, body);
   
    });

    it('PassagemController + PassagemService integration test criar passagem', async function () {
        // Arrange	
        let body = {
            "id": 1,
            "codigoEdificioA": "COD1",
            "codigoEdificioB": "COD2",
            "numeroPisoA": 1,
            "numeroPisoB": 2,
        };

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.spy(),
        };

        let next: Partial<NextFunction> = () => { };

        let metadata = {
            id: 1,
            abcissaA: 0,
            ordenadaA: 0,
            abcissaB: 0,
            ordenadaB: 0,
            orientacao: "Norte",
            codigoEdificioA: "COD1",
            codigoEdificioB: "COD2",
            numeroPisoA: 1,
            numeroPisoB: 2,
        }

        let data = await createAllData(metadata.codigoEdificioA, metadata.numeroPisoA, metadata.codigoEdificioB, metadata.numeroPisoB,
            metadata.abcissaA, metadata.ordenadaA, metadata.abcissaB, metadata.ordenadaB);

        const edificioA = data.getValue().edificioA
        const edificioB = data.getValue().edificioB

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificioA));
        stubRepo.onCall(1).returns(Promise.resolve(edificioB));
        let passagemRepo = Container.get("PassagemRepo") as IPassagemRepo;
        let stubPassagemRepo = sinon.stub(passagemRepo, 'findByDomainId');
        stubPassagemRepo.onCall(0).returns(null);
        let stubRepo2 = sinon.stub(passagemRepo, 'save');
        stubRepo2.onCall(0).returns(Promise.resolve(Passagem));
        stubRepo2 = sinon.stub(passagemRepo, 'getMaxId');
        stubRepo2.onCall(0).returns(Promise.resolve(1));
        let stubRepoo = sinon.stub(edificioRepo, 'save');
        stubRepoo.onCall(0).returns(Promise.resolve(edificioA));
        stubRepoo.onCall(1).returns(Promise.resolve(edificioB));

        let passagemServiceInstance = Container.get("PassagemService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        const passagemServiceSpy = sinon.spy(passagemServiceInstance, 'criarPassagem');

        const passagemController = new PassagemController(passagemServiceInstance as IPassagemService, authServiceInstance as IAuthService);

        // Act
        await passagemController.criarPassagem(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledWith(passagemServiceSpy, body as IPassagemDTO);

    });

    it('PassagemController + PassagemService + PassagemRepo integração test criar passagem devolve passagem', async function () {
        // Arrange	
        let body = {
            "id": 1,
            "codigoEdificioA": "COD1",
            "codigoEdificioB": "COD2",
            "numeroPisoA": 1,
            "numeroPisoB": 2,
        };


        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
        };

        let next: Partial<NextFunction> = () => { };

        let metadata = {
            id: 1,
            abcissaA: 0,
            ordenadaA: 0,
            abcissaB: 0,
            ordenadaB: 0,
            orientacao: "Norte",
            codigoEdificioA: "COD1",
            codigoEdificioB: "COD2",
            numeroPisoA: 1,
            numeroPisoB: 2,
        }



        let data = await createAllData(metadata.codigoEdificioA, metadata.numeroPisoA, metadata.codigoEdificioB, metadata.numeroPisoB,
            metadata.abcissaA, metadata.ordenadaA, metadata.abcissaB, metadata.ordenadaB);

        const edificioA = data.getValue().edificioA
        const edificioB = data.getValue().edificioB
        const pisoA = data.getValue().pisoA
        const pisoB = data.getValue().pisoB

        let passagemPersistence = {
            domainID: 1,
            pisoA: pisoA,
            pisoB: pisoB,
        } as IPassagemPersistence;


        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificioA));
        stubRepo.onCall(1).returns(Promise.resolve(edificioB));

        const passagemSchemaInstance = Container.get("PassagemSchema");
        sinon.stub(passagemSchemaInstance, "findOne").returns(null);
        sinon.stub(passagemSchemaInstance, "create").returns(passagemPersistence as IPassagemPersistence);
        const repoStub = Container.get("PassagemRepo");
        const stub = sinon.stub(repoStub, 'getMaxId');
        stub.onCall(0).returns(Promise.resolve(1));
        const pisoRepo = Container.get("PisoRepo");
        const stubPisoRepo = sinon.stub(pisoRepo, 'findByDomainId');
        stubPisoRepo.onCall(0).returns(Promise.resolve(pisoA));
        stubPisoRepo.onCall(1).returns(Promise.resolve(pisoB));

        let passagemServiceInstance = Container.get("PassagemService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        const passagemServiceSpy = sinon.spy(passagemServiceInstance, 'criarPassagem');

        const pisoController = new PassagemController(passagemServiceInstance as IPassagemService, authServiceInstance as IAuthService);

        await pisoController.criarPassagem(<Request>req, <Response>res, <NextFunction>next);


        sinon.assert.calledOnce(passagemServiceSpy);
        sinon.assert.calledWith(passagemServiceSpy, body as IPassagemDTO);

    });


    it('listarPassagensPorParDeEdifício retorna passagens JSON', async function() {
        
        let body = {
        };
        
        let listaDTO : IListarPassagemDTO[] = [];
        const passagemDTO = {
            id: 1,
            numeroPisoA: 1,
            idPisoA: 1,
            numeroPisoB: 1,
            idPisoB: 2,
        } as IListarPassagemDTO;

        listaDTO.push(passagemDTO);

        let req: Partial<Request> = {};
        req.query = body;
        
        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let passagemServiceInstance = Container.get("PassagemService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        sinon.stub(passagemServiceInstance, 'listarPassagensPorParDeEdificios').returns(Promise.resolve(Result.ok<IListarPassagemDTO[]>(listaDTO)));

        const passagemController = new PassagemController(passagemServiceInstance as IPassagemService, authServiceInstance as IAuthService);
        
        await passagemController.listarPassagensPorParDeEdificios(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });

    it('(Listar passagem por par de edifícios) Teste de integração PassagemController + PassagemService', async function() {
        
        let body = {
        };
        
        let listaDTO : IListarPassagemDTO[] = [];
        const passagemDTO = {
            id: 1,
            numeroPisoA: 1,
            idPisoA: 1,
            numeroPisoB: 1,
            idPisoB: 2,
        } as IListarPassagemDTO;

        listaDTO.push(passagemDTO);

        let req: Partial<Request> = {};
        req.query = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let passagemServiceInstance = Container.get("PassagemService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        let passagemRepoInstance = Container.get("PassagemRepo");

        sinon.stub(passagemRepoInstance, 'findAll').returns(Promise.resolve([Container.get("Passagem")]));

        const passagemController = new PassagemController(passagemServiceInstance as IPassagemService, authServiceInstance as IAuthService);
        
        await passagemController.listarPassagensPorParDeEdificios(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });

    it('(Listar passagem por par de edifícios) Teste de integração PassagemController + PassagemService + PassagemRepo', async function() {
        
        let body = {
        };
        
        
        const passagemPersistence = {
            domainID: 1,
            pisoA: 1,
            pisoB: 2,
        } as IPassagemPersistence;



        let listaDTO : IListarPassagemDTO[] = [];
        const passagemDTO = {
            id: 1,
            numeroPisoA: 1,
            idPisoA: 1,
            numeroPisoB: 1,
            idPisoB: 2,
        } as IListarPassagemDTO;

        listaDTO.push(passagemDTO);

        let req: Partial<Request> = {};
        req.query = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let passagemServiceInstance = Container.get("PassagemService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        let pisoRepoInstance = Container.get("PisoRepo");
        let passagemSchemaInstance = Container.get("PassagemSchema");

        sinon.stub(passagemSchemaInstance, "find").returns(Promise.resolve([passagemPersistence]));

        let stubFindByIdPisoRepo = sinon.stub(pisoRepoInstance, 'findByDomainId');
        stubFindByIdPisoRepo.onCall(0).returns(Promise.resolve(Container.get("Piso1")));
        stubFindByIdPisoRepo.onCall(1).returns(Promise.resolve(Container.get("Piso2")));

        const passagemController = new PassagemController(passagemServiceInstance as IPassagemService, authServiceInstance as IAuthService);
        
        await passagemController.listarPassagensPorParDeEdificios(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });

});

function createAllData(codigoEdificioA: string, numeroPisoA: number, codigoEdificioB: string,
    numeroPisoB: number, abcissaA: number, ordenadaA: number, abcissaB: number, ordenadaB: number): Promise<Result<any>> {

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
    let edificiosPropsB = {
        nome: Nome.create("DEM").getValue(),
        dimensao: Dimensao.create(3, 3).getValue(),
        descricao: DescricaoEdificio.create("DEM").getValue(),
        listaPisos: [],
    }

    // criar codigos edificios
    let codigoEdificio = Codigo.create(codigoEdificioA).getValue();
    codigoEdificio = Codigo.create(codigoEdificioB).getValue();

    // criar edificios
    let edificioA = Edificio.create(edificioPropsA, codigoEdificio).getValue();
    let edificioB = Edificio.create(edificiosPropsB, codigoEdificio).getValue();

    // criar mapa
    let mapa;

    // criar props pisos
    let pisoPropsA: pisoProps = {
        numeroPiso: NumeroPiso.create(numeroPisoA).getValue(),
        descricaoPiso: DescricaoPiso.create("Piso 1").getValue(),
        mapa: mapa,
    }
    let pisoPropsB: pisoProps = {
        numeroPiso: NumeroPiso.create(numeroPisoB).getValue(),
        descricaoPiso: DescricaoPiso.create("Piso 2").getValue(),
        mapa: mapa,
    }

    // criar pisos
    let pisoA = Piso.create(pisoPropsA).getValue();
    let pisoB = Piso.create(pisoPropsB).getValue();

    // adicionar pisos aos edificios
    edificioA.addPiso(pisoA);
    edificioB.addPiso(pisoB);

    if (edificioA == null || edificioB == null || pisoA == null || pisoB == null) {
        return Promise.resolve(Result.fail<void>("Erro ao criar dados de test"));
    }

    return Promise.resolve(Result.ok<any>({
        "id": 2,
        "edificioA": edificioA,
        "edificioB": edificioB,
        "pisoA": pisoA,
        "pisoB": pisoB
    }));
}