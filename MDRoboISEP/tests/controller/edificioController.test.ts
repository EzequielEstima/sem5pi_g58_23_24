import {Response, Request, NextFunction} from 'express';import * as sinon from 'sinon';
import Container from 'typedi';
import  IEdificioDTO  from '../../src/dto/IEdificioDTO';
import { Result }  from '../../src/core/logic/Result';
import EdificioController from '../../src/controllers/ImplControllers/EdificioController';
import IEdificioService from '../../src/services/IServices/IEdificioService';
import { Nome } from '../../src/domain/edificio/Nome';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Piso } from '../../src/domain/piso/Piso';
import { NumeroPiso } from '../../src/domain/piso/NumeroPiso';
import { DescricaoPiso } from '../../src/domain/piso/DescricaoPiso';
import { IdPiso } from '../../src/domain/piso/IdPiso';
import { Edificio } from '../../src/domain/edificio/Edificio';
import { Codigo } from '../../src/domain/edificio/Codigo';
import { IEdificioPersistence } from '../../src/dataschema/IEdificioPersistence';
import { Document } from 'mongoose';
import IAuthService from '../../src/services/IServices/IAuthService';
import 'reflect-metadata';


describe('EdificioController', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        this.timeout(300000);
        Container.reset();
        
        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoRepoInstance);

        let pisoSchemaInstance = require('../../src/persistence/schemas/PisoSchema').default;
        Container.set("PisoSchema", pisoSchemaInstance);

        let pisoRepoClass = require('../../src/repos/PisoRepo').default;
        let pisoRepoInstance = Container.get(pisoRepoClass);
        Container.set("PisoRepo", pisoRepoInstance);

        let mapaSchemaInstance = require('../../src/persistence/schemas/MapaSchema').default;
        Container.set("MapaSchema", mapaSchemaInstance);

        let mapaRepoClass = require('../../src/repos/MapaRepo').default;
        let mapaRepoInstance = Container.get(mapaRepoClass);
        Container.set("MapaRepo", mapaRepoInstance);

        let salaSchemaInstance = require('../../src/persistence/schemas/SalaSchema').default;
        Container.set("SalaSchema", salaSchemaInstance);

        let salaRepoClass = require('../../src/repos/SalaRepo').default;
        let salaRepoInstance = Container.get(salaRepoClass);
        Container.set("SalaRepo", salaRepoInstance);

        let passagemSchemaInstance = require('../../src/persistence/schemas/PassagemSchema').default;
        Container.set("PassagemSchema", passagemSchemaInstance);

        let passagemRepoClass = require('../../src/repos/PassagemRepo').default;
        let passagemRepoInstance = Container.get(passagemRepoClass);
        Container.set("PassagemRepo", passagemRepoInstance);

        let elevadorSchemaInstance = require('../../src/persistence/schemas/ElevadorSchema').default;
        Container.set("ElevadorSchema", elevadorSchemaInstance);

        let elevadorRepoClass = require('../../src/repos/ElevadorRepo').default;
        let elevadorRepoInstance = Container.get(elevadorRepoClass);
        Container.set("ElevadorRepo", elevadorRepoInstance);

        let edificioServiceClass = require('../../src/services/ImplServices/EdificioService').default;
        let edificioServiceInstance = Container.get(edificioServiceClass);
        Container.set("EdificioService", edificioServiceInstance);

        let authServiceClass = require('../../src/services/ImplServices/AuthService').default;
        let authServiceInstance = Container.get(authServiceClass);
        Container.set("AuthService", authServiceInstance);

    });

    afterEach(function() {
        sinon.restore();
        sandbox.restore();
    });
/*
    it('Criar edificio retorna edificio JSON', async function() {
            
            // Arrange
            let body = {
                "codigo": "as1",
                "nome": "ola",
                "descricao": "ola",
            };
    
            let req: Partial<Request> = {};
            req.body = body;
    
            let res: Partial<Response> = {
                status: sinon.spy(),
                json: sinon.spy()
            } 
    
            let next: Partial<NextFunction> = () => {};
            let edificioServiceInstance = Container.get("EdificioService");
            let authServiceInstance = Container.get("AuthService");
            sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
            sinon.stub(edificioServiceInstance, 'criarEdificio').returns(Promise.resolve(Result.ok<IEdificioDTO>(body as IEdificioDTO)));

            let edificioController = new EdificioController(edificioServiceInstance as IEdificioService, authServiceInstance as IAuthService);
            
            // Act
            await edificioController.criarEdificio(<Request> req,<Response> res, <NextFunction> next);
    
            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonSpy);
            sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
            sinon.assert.calledOnce(res.json as sinon.SinonSpy);
            sinon.assert.calledWith(res.json as sinon.SinonSpy, body);
    });
*/
    it('EdificioController + EdificioService criar edificio', async function() {
        // Arrange
        let body = {
            "codigo": "as1",
            "nome": "ola",
            "descricao": "ola",
            "dimensaoX": 1,
            "dimensaoY": 1,
        };
        let edificioProps : any = {
            nome : Nome.create(body.nome).getValue(),
            dimensao : Dimensao.create(body.dimensaoX,body.dimensaoY).getValue(),
            descricao : DescricaoEdificio.create(body.descricao).getValue(),
            listaPisos : [],
        }
        let edificio = Edificio.create(edificioProps,Codigo.create(body.codigo).getValue()).getValue();
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};
        
        let edificioServiceInstance = Container.get("EdificioService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        let edificioRepoInstance = Container.get("EdificioRepo");
        const edificioServiceSpy = sinon.spy(edificioServiceInstance, 'criarEdificio');
        
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        sinon.stub(edificioRepoInstance, "save").returns(Promise.resolve(edificio));
        // Act
        let edificioController = new EdificioController(edificioServiceInstance as IEdificioService, authServiceInstance as IAuthService);
        await edificioController.criarEdificio(<Request> req,<Response> res, <NextFunction> next);

        // Assert
        sinon.assert.calledOnce(edificioServiceSpy);
        sinon.assert.calledWith(edificioServiceSpy, body);
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, body);
        
});

it('EdificioController + EdificioService + EdificioRepo criar edificio', async function() {
    // Arrange
    let body = {
        "codigo": "as1",
        "nome": "ola",
        "descricao": "ola",
        "dimensaoX": 1,
        "dimensaoY": 1,
    };
    let edificioProps : any = {
        nome : Nome.create(body.nome).getValue(),
        dimensao : Dimensao.create(body.dimensaoX,body.dimensaoY).getValue(),
        descricao : DescricaoEdificio.create(body.descricao).getValue(),
        listaPisos : [],
    }

    let listaPiso : [] = [];
    let elevador;
    
    const edificioPersistence = {
        codigo : body.codigo,
        nome : body.nome,
        descricao : body.descricao,
        dimensaoX: body.dimensaoX,
        dimensaoY: body.dimensaoY,
        piso : listaPiso,
        elevador : elevador,
    } as IEdificioPersistence

    let edificio = Edificio.create(edificioProps,Codigo.create(body.codigo).getValue()).getValue();
    let req: Partial<Request> = {};
    req.body = body;

    let res: Partial<Response> = {
        status: sinon.spy(),
        json: sinon.spy()
    };

    let next: Partial<NextFunction> = () => {};
    
    let edificioServiceInstance = Container.get("EdificioService");
    let authServiceInstance = Container.get("AuthService");
    sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
    const edificioServiceSpy = sinon.spy(edificioServiceInstance, 'criarEdificio');
    let edificioSchemaInstance = Container.get("EdificioSchema");

    sinon.stub(edificioSchemaInstance, "findOne").returns(null);
    sinon.stub(edificioSchemaInstance, "create").returns(edificioPersistence);
    
    // Act
    let edificioController = new EdificioController(edificioServiceInstance as IEdificioService, authServiceInstance as IAuthService);
    await edificioController.criarEdificio(<Request> req,<Response> res, <NextFunction> next);

    // Assert
    sinon.assert.calledOnce(edificioServiceSpy);
    sinon.assert.calledWith(edificioServiceSpy, body);
    sinon.assert.calledOnce(res.status as sinon.SinonSpy);
    sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
    sinon.assert.calledOnce(res.json as sinon.SinonSpy);
    sinon.assert.calledWith(res.json as sinon.SinonSpy, body);
});
    it('Listar edificio retorna lista de edificios em JSON', async function() {

        let listaDTO : IEdificioDTO[] = [];
        let edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : [],
        } as IEdificioDTO
        listaDTO.push(edificioDTO);

        let req: Partial<Request> = {};
        let res: Partial<Response> = {
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};
        let edificioServiceInstance = Container.get("EdificioService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        sinon.stub(edificioServiceInstance, 'listarEdificios').returns(Promise.resolve(Result.ok<IEdificioDTO[]>(listaDTO)));

        let edificioController = new EdificioController(edificioServiceInstance as IEdificioService, authServiceInstance as IAuthService);

        // Act
        await edificioController.listarEdificios(<Request> req,<Response> res, <NextFunction> next);

        // Assert
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });

    it('EdificioController + EdificioService teste de integração ao método listarEdificios', async function() {

        let body = {
            "codigo": "as1",
            "nome": "ola",
            "descricao": "ola",
            "dimensaoX": 1,
            "dimensaoY": 1,
        };
        
        
        let edificioProps : any ={
            nome : Nome.create(body.nome).getValue(),
            dimensao : Dimensao.create(body.dimensaoX,body.dimensaoY).getValue(),
            descricao : DescricaoEdificio.create(body.descricao).getValue(),
            listaPisos : [],
        }
        let edificio = Edificio.create(edificioProps,Codigo.create(body.codigo).getValue()).getValue();

        let req: Partial<Request> = {};
        let res: Partial<Response> = {
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};
        let edificioServiceInstance = Container.get("EdificioService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        let edificioServiceSpy = sinon.spy(edificioServiceInstance, 'listarEdificios');
        let edificioRepoInstance = Container.get("EdificioRepo");
        sinon.stub(edificioRepoInstance, "getAllEdificios").returns(Promise.resolve([edificio]));
        let edificioController = new EdificioController(edificioServiceInstance as IEdificioService, authServiceInstance as IAuthService);
        await edificioController.listarEdificios(<Request> req,<Response> res, <NextFunction> next);

        sinon.assert.calledOnce(edificioServiceSpy);
        sinon.assert.calledWith(edificioServiceSpy);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, [body]);
    });

    it('EdificioController + EdificioService + EdificioRepo teste de integração ao método listarEdificios', async function() {
        let body = {
            "codigo": "as1",
            "nome": "ola",
            "descricao": "ola",
            "dimensaoX": 1,
            "dimensaoY": 1,
        };
        let edificioProps : any ={
            nome : Nome.create(body.nome).getValue(),
            dimensao : Dimensao.create(body.dimensaoX,body.dimensaoY).getValue(),
            descricao : DescricaoEdificio.create(body.descricao).getValue(),
            listaPisos : [],
        }
        let listaPiso : number [] = []; 
        const edificioPersistence = {
            codigo : body.codigo,
            nome : body.nome,
            descricao : body.descricao,
            dimensaoX: body.dimensaoX,
            dimensaoY: body.dimensaoY,
            piso : listaPiso,
        } as IEdificioPersistence & Document<any, any, any>;

        let req: Partial<Request> = {};
        let res: Partial<Response> = {
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        let edificioServiceInstance = Container.get("EdificioService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        let edificioServiceSpy = sinon.spy(edificioServiceInstance, 'listarEdificios');
        let edificioRepoInstance = Container.get("EdificioRepo");
        let edificioSchemaInstance = Container.get("EdificioSchema");

        sinon.stub(edificioSchemaInstance, "find").returns([edificioPersistence]);
        let edificioController = new EdificioController(edificioServiceInstance as IEdificioService, authServiceInstance as IAuthService);
        await edificioController.listarEdificios(<Request> req,<Response> res, <NextFunction> next);

        sinon.assert.calledOnce(edificioServiceSpy);
        sinon.assert.calledWith(edificioServiceSpy);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, [body]);
    });

    it('listarEdificioMinEMaxPisos retorna lista de edificios em JSON', async function() {

        let listaDTO : IEdificioDTO[] = [];
        let edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : [],
        } as IEdificioDTO
        listaDTO.push(edificioDTO);
           // Arrange
        let body = {
            "minPisos": 0,
            "maxPisos": 1,
        };

        let req: Partial<Request> = {};
        req.query = body as any;
        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};
        let edificioServiceInstance = Container.get("EdificioService");
        let authServiceInstance = Container.get("AuthService");

        sinon.stub(edificioServiceInstance, 'listarEdificioMinEMaxPisos').returns(Promise.resolve(Result.ok<IEdificioDTO[]>(listaDTO)));
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        let edificioController = new EdificioController(edificioServiceInstance as IEdificioService, authServiceInstance as IAuthService);

        // Act
        await edificioController.listarEdificioMinEMaxPisos(<Request> req,<Response> res, <NextFunction> next);

        // Assert

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });
 
    it('EdificioController + EdificioService teste de integração ao método listarEdificioMinEMaxPisos', async function() {

        let listaDTO : IEdificioDTO[] = [];
        let edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
        } as IEdificioDTO
        listaDTO.push(edificioDTO);
           // Arrange
        let body = {
            "minPisos": 0,
            "maxPisos": 1,
        };
        let mapa;
        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(1,1).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [Piso.create({numeroPiso: NumeroPiso.create(1).getValue(),
                                    descricaoPiso: DescricaoPiso.create("ola").getValue(),
                                    mapa: mapa}, IdPiso.create(1).getValue()).getValue()],
                                
        };

        let req: Partial<Request> = {};req.query = body as any;
        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        let edificio = Edificio.create(edificioProps,Codigo.create('ED01').getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo");


        let edificioServiceInstance = Container.get("EdificioService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(edificioRepoInstance, "getAllEdificios").returns(Promise.resolve([edificio]));     
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());   
        const edificioServiceSpy = sinon.spy(edificioServiceInstance, 'listarEdificioMinEMaxPisos');

        const pisoController =  new EdificioController(edificioServiceInstance as IEdificioService, authServiceInstance as IAuthService); 
        // Act
        await pisoController.listarEdificioMinEMaxPisos(<Request> req,<Response> res, <NextFunction> next);

        // Assert
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledOnce(edificioServiceSpy);
        sinon.assert.calledWith(edificioServiceSpy, body);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });

     
    it('EdificioController + EdificioService + EdificioRepo teste de integração ao método listarEdificioMinEMaxPisos', async function() {

        let listaDTO : IEdificioDTO[] = [];
        let edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
        } as IEdificioDTO
        listaDTO.push(edificioDTO);
        // Arrange
        let body = {
            "minPisos": 0,
            "maxPisos": 1,
        };


        let listaPiso : number [] = []; 
        
        const edificioDTO2 = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : listaPiso,
            save() { return this; }
        } as IEdificioPersistence & Document<any, any, any>;

        let req: Partial<Request> = {};
        req.query = body as any;
        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const edificioSchemaInstance = Container.get("EdificioSchema");
        sinon.stub(edificioSchemaInstance, "find").returns([edificioDTO2]);

        let edificioServiceInstance = Container.get("EdificioService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        const edificioServiceSpy = sinon.spy(edificioServiceInstance, 'listarEdificioMinEMaxPisos');
        const pisoController =  new EdificioController(edificioServiceInstance as IEdificioService, authServiceInstance as IAuthService); 
        // Act
        await pisoController.listarEdificioMinEMaxPisos(<Request> req,<Response> res, <NextFunction> next);

        // Assert

        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledOnce(edificioServiceSpy);
        sinon.assert.calledWith(edificioServiceSpy, body);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, listaDTO);
    });


    
    it('Editar edificio retorna edificio JSON', async function() {
        let body = {
            "codigo" : "ED01",
            "nome" : "Edificio A",
            "descricao" : "Edificio A",
        }
        
        let req: Partial<Request> = {};
        req.body = body;
        let res: Partial<Response> = {
            json: sinon.spy(),
        };
        let next: Partial<NextFunction> = () => {};
        let edificioServiceInstance = Container.get("EdificioService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        sinon.stub(edificioServiceInstance, 'editarEdificio').returns(Promise.resolve(Result.ok<IEdificioDTO>(body as IEdificioDTO)));
        let edificioController = new EdificioController(edificioServiceInstance as IEdificioService, authServiceInstance as IAuthService);

        //Act
        await edificioController.editarEdificio(<Request> req,<Response> res, <NextFunction> next);

        //Assert
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, body);
    });

    it('EdificioController + EdificioService teste de integração ao método editarEdificio', async function() {
        let body = {
            "codigo" : "ED01",
            "nome" : "Edificio A",
            "descricao" : "Edificio A",
        }
        let req: Partial<Request> = {};
        req.body = body;
        let res: Partial<Response> = {
            json: sinon.spy(),
        };
        let next: Partial<NextFunction> = () => {};
        let propsAnterior : any = {
            nome : Nome.create("velho").getValue(),
            dimensao : Dimensao.create(1,1).getValue(),
            descricao : DescricaoEdificio.create("velho").getValue(),
            listaPisos : [],
        }
        let propsNovo : any = {
            nome : Nome.create(body.nome).getValue(),
            dimensao : Dimensao.create(1,1).getValue(),
            descricao : DescricaoEdificio.create(body.descricao).getValue(),
            listaPisos : [],
        }

        let edificioVelho = Edificio.create(propsAnterior,Codigo.create(body.codigo).getValue()).getValue();
        let edificioNovo = Edificio.create(propsNovo,Codigo.create(body.codigo).getValue()).getValue();

        let edificioServiceInstance = Container.get("EdificioService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        let edificioServiceSpy = sinon.spy(edificioServiceInstance, 'editarEdificio');
        let edificioRepoInstance = Container.get("EdificioRepo");
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(edificioVelho));
        sinon.stub(edificioRepoInstance, "save").returns(Promise.resolve(edificioNovo));

        let edificioController = new EdificioController(edificioServiceInstance as IEdificioService, authServiceInstance as IAuthService);
        await edificioController.editarEdificio(<Request> req,<Response> res, <NextFunction> next);

        sinon.assert.calledOnce(edificioServiceSpy);
        sinon.assert.calledWith(edificioServiceSpy, body);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, body);
    });

    it('EdificioController + EdificioService + EdificioRepo teste de integração ao método editarEdificio', async function() {
        let body = {
            "codigo" : "ED01",
            "nome" : "Edificio A",
            "descricao" : "Edificio A",
        };
        let req: Partial<Request> = {};
        req.body = body;
        let res: Partial<Response> = {
            json: sinon.spy(),
        };
        let next: Partial<NextFunction> = () => {};
        let propsAnterior : any = {
            nome : Nome.create("velho").getValue(),
            dimensao : Dimensao.create(1,1).getValue(),
            descricao : DescricaoEdificio.create("velho").getValue(),
            listaPisos : [],
        }
        let propsNovo : any = {
            nome : Nome.create(body.nome).getValue(),
            dimensao : Dimensao.create(1,1).getValue(),
            descricao : DescricaoEdificio.create(body.descricao).getValue(),
            listaPisos : [],
        }
        let elevador;
    
        const edificioPersistenceVelho = {
            codigo : "velho",
            nome : "velho",
            descricao : "velho",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : [],
            elevador : elevador,
            save() { return this; }
        } as IEdificioPersistence

        const edificioPersistenceNovo = {
            codigo : body.codigo,
            nome : body.nome,
            descricao : body.descricao,
            dimensaoX: 1,
            dimensaoY: 1,
            piso : [],
            elevador : elevador,      
        } as IEdificioPersistence



        let edificioServiceInstance = Container.get("EdificioService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        let edificioServiceSpy = sinon.spy(edificioServiceInstance, 'editarEdificio');
        let edificioRepoInstance = Container.get("EdificioRepo");
        let edificioSchemaInstance = Container.get("EdificioSchema");

        sinon.stub(edificioSchemaInstance, "findOne").returns(edificioPersistenceVelho);
        sinon.stub(edificioSchemaInstance, "create").returns(edificioPersistenceNovo);

        let edificioController = new EdificioController(edificioServiceInstance as IEdificioService, authServiceInstance as IAuthService);
        await edificioController.editarEdificio(<Request> req,<Response> res, <NextFunction> next);

        sinon.assert.calledOnce(edificioServiceSpy);
        sinon.assert.calledWith(edificioServiceSpy, body);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, body);

    });
});