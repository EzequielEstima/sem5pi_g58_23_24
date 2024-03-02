import * as sinon from "sinon";
import { Container } from "typedi";
import { Request, Response, NextFunction } from "express";
import { Result } from "../../src/core/logic/Result";
import ICarregarMapaDTO from "../../src/dto/ICarregarMapaDTO";
import IMapaService from "../../src/services/IServices/IMapaService";
import MapaController from "../../src/controllers/ImplControllers/MapaController";
import { Nome } from "../../src/domain/edificio/Nome";
import { Dimensao } from "../../src/domain/edificio/Dimensao";
import { Edificio } from "../../src/domain/edificio/Edificio";
import { Codigo } from "../../src/domain/edificio/Codigo";
import Categorizacao from "../../src/domain/sala/CategorizacaoSala";
import DescricaoSala from "../../src/domain/sala/DescricaoSala";
import { Sala } from "../../src/domain/sala/Sala";
import NomeSala from "../../src/domain/sala/NomeSala";
import IEdificioRepo from "../../src/services/IRepos/IEdificioRepo";
import ISalaRepo from "../../src/services/IRepos/ISalaRepo";
import IPassagemRepo from "../../src/services/IRepos/IPassagemRepo";
import IMapaRepo from "../../src/services/IRepos/IMapaRepo";
import IPisoRepo from "../../src/services/IRepos/IPisoRepo";
import { Passagem } from "../../src/domain/passagem/Passagem";
import { IdPassagem } from "../../src/domain/passagem/IdPassagem";
import { Mapa } from "../../src/domain/mapa/Mapa";
import { IdMapa } from "../../src/domain/mapa/IdMapa";
import { Piso } from "../../src/domain/piso/Piso";
import { Elevador } from "../../src/domain/elevador/Elevador";
import { MarcaElevador } from "../../src/domain/elevador/MarcaElevador";
import { ModeloElevador } from "../../src/domain/elevador/ModeloElevador";
import { NumeroSerieElevador } from "../../src/domain/elevador/NumeroSerieElevador";
import { DescricaoElevador } from "../../src/domain/elevador/DescricaoElevador";
import { IdElevador } from "../../src/domain/elevador/IdElevador";
import { DescricaoPiso } from "../../src/domain/piso/DescricaoPiso";
import { IdPiso } from "../../src/domain/piso/IdPiso";
import { NumeroPiso } from "../../src/domain/piso/NumeroPiso";
import { TipoPonto } from "../../src/domain/mapa/TipoPonto";
import IExportarMapaDTO from "../../src/dto/IExportarMapaDTO";
import IAuthService from "../../src/services/IServices/IAuthService";
import 'reflect-metadata';

describe('Mapa Controller', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        this.timeout(300000);
        Container.reset();

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

        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);
        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

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

        let mapaServiceClass = require('../../src/services/ImplServices/MapaService').default;
        let mapaServiceInstance = Container.get(mapaServiceClass);
        Container.set("MapaService", mapaServiceInstance);

        let authServiceClass = require('../../src/services/ImplServices/AuthService').default;
        let authServiceInstance = Container.get(authServiceClass);
        Container.set("AuthService", authServiceInstance);

        let descricaoPiso = DescricaoPiso.create("Ola").getValue();
		let idPiso = IdPiso.create(1).getValue();
		let numeroPiso = NumeroPiso.create(0).getValue();

        let descricaoPiso2 = DescricaoPiso.create("Ola2").getValue();
        let idPiso2 = IdPiso.create(2).getValue();
        let numeroPiso2 = NumeroPiso.create(1).getValue();

        let descricaoPiso3 = DescricaoPiso.create("Ola3").getValue();
        let idPiso3 = IdPiso.create(3).getValue();
        let numeroPiso3 = NumeroPiso.create(3).getValue();

        let descricaoPiso4 = DescricaoPiso.create("Ola4").getValue();
        let idPiso4 = IdPiso.create(4).getValue();
        let numeroPiso4 = NumeroPiso.create(0).getValue();


        let mapa;

        let mapaTipoPonto : TipoPonto[][] = [];
        for(let i = 0; i <= 5; i++){
            mapaTipoPonto[i] = [];
            for(let j = 0; j <= 5; j++){
                mapaTipoPonto[i][j] = TipoPonto.create(" ").getValue();
            }
        }
        let mapaCompleto = Mapa.create({mapa: mapaTipoPonto}, IdMapa.create(1).getValue()).getValue();

        mapaCompleto.carregarMapaComBermas();
        mapaCompleto.criarPontosElevador(3,3,"Norte");
        mapaCompleto.carregarSalaMapa("sala1",0,0,2,2,1,0,"Norte");
        mapaCompleto.carregarPassagemMapa({id:1,abcissa:5,ordenada:3,orientacao:"Oeste"});

		let piso5x5 = Piso.create({
			numeroPiso: numeroPiso,
			descricaoPiso: descricaoPiso,
			mapa: mapaCompleto,
		}, idPiso).getValue();
		Container.set ('piso5x5',piso5x5);

        let piso5x5_2 = Piso.create({
            numeroPiso: numeroPiso2,
            descricaoPiso: descricaoPiso2,
            mapa: mapa,
        }, idPiso2).getValue();
        Container.set ('piso5x5_2',piso5x5_2);

        let piso5x5_3 = Piso.create({
            numeroPiso: numeroPiso3,
            descricaoPiso: descricaoPiso3,
            mapa: mapa,
        }, idPiso3).getValue();
        Container.set ('piso5x5_3',piso5x5_3);

        let piso5x5Vazio = Piso.create({
			numeroPiso: numeroPiso4,
			descricaoPiso: descricaoPiso4,
			mapa: mapa,
		}, idPiso4).getValue();
		Container.set ('piso5x5Vazio',piso5x5Vazio);

        let elevador =  Elevador.create({
            pisosServidos: [Container.get('piso5x5Vazio'), Container.get('piso5x5_2')],
            marca: MarcaElevador.create("Marca").getValue(),
            modelo: ModeloElevador.create("Modelo").getValue(),
            numeroSerie : NumeroSerieElevador.create("NumeroSerie").getValue(),
            descricao : DescricaoElevador.create("Descricao").getValue(),
        }, IdElevador.create(1).getValue()).getValue()
        Container.set('elevador', elevador);
    });
    afterEach(function() {
        sinon.restore();
        sandbox.restore();
    });

    it('Carregar mapa retorna carregarMapaDTO', async function(){
        let body = {
            "codigoEdificio": "ED01",
            "numeroPiso" : 0,
            "passagens" : [{
                "id": 1,
                "abcissa": 3,
                "ordenada": 2,
                "orientacao": "Norte"
            }],
            "elevador" : {
                "xCoord" : 3,
                "yCoord" : 3,
                "orientacao": "Norte"   
            },
            "salas": [{
                "nome": "B203",
                "abcissaA": 0,
                "ordenadaA": 0,
                "abcissaB": 2,
                "ordenadaB": 2,
                "abcissaPorta" : 1,
                "ordenadaPorta" : 0,
                "orientacaoPorta" : "Norte"
            }]
        }

        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let mapaServiceInstance = Container.get("MapaService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, "checkAuth").returns(Result.ok<void>());
        sinon.stub(mapaServiceInstance, "carregarMapa").returns(Promise.resolve(Result.ok<ICarregarMapaDTO>(body as ICarregarMapaDTO)));

        const mapaController = new MapaController(mapaServiceInstance as IMapaService, authServiceInstance as IAuthService);
        await mapaController.carregarMapa(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, body);
    });

    it('PontoController + PontoService carregarMapa', async function(){
        let body = {
            "codigoEdificio": "ED01",
            "numeroPiso" : 0,
            "passagens" : [{
                "id": 1,
                "abcissa": 3,
                "ordenada": 2,
                "orientacao": "Norte"
            }],
            "elevador" : {
                "xCoord" : 3,
                "yCoord" : 3,
                "orientacao": "Norte"   
            },
            "salas": [{
                "nome": "B203",
                "abcissaA": 0,
                "ordenadaA": 0,
                "abcissaB": 2,
                "ordenadaB": 2,
                "abcissaPorta" : 1,
                "ordenadaPorta" : 0,
                "orientacaoPorta" : "Norte"
            }]
        }
        
        let req: Partial<Request> = {};
        req.body = body;
        let res: Partial<Response> = {
            status : sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};


        let edificioProps : any = {
            nome: Nome.create('ED01 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [Container.get('piso5x5Vazio'), Container.get('piso5x5_2')],
        };   
        
        let edificio = Edificio.create(edificioProps, Codigo.create(body.codigoEdificio).getValue()).getValue();
        edificio.adicionarElevador(Container.get('elevador'));

        let salaProps : any = {
            piso : edificio.returnListaPisos()[0],
            categoria : Categorizacao.create("Gabinete").getValue(),
            descricao : DescricaoSala.create("B203").getValue(),
        }
        let sala = Sala.create(salaProps, NomeSala.create(body.salas[0].nome).getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        let mapaProps : any = {
            mapa : [],
        }

        let mapa = Mapa.create(mapaProps, IdMapa.create(1).getValue()).getValue();


        let passagemProps : any = {
            pisoA : edificio.returnListaPisos()[0],
            pisoB : Container.get('piso5x5Vazio'),
        }
        let passagem = Passagem.create(passagemProps, IdPassagem.create(1).getValue()).getValue();

        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(edificio));
        sinon.stub(mapaRepoInstance, 'getMaxId').returns(Promise.resolve(0));
        sinon.stub(salaRepoInstance, 'findSalasByPiso').returns(Promise.resolve([sala]));
        sinon.stub(passagemRepoInstance, 'listarPassagensComUmPiso').returns(Promise.resolve([passagem]));
        sinon.stub(mapaRepoInstance, 'save').returns(Promise.resolve(mapa));
        sinon.stub(pisoRepoInstance, 'save').returns(Promise.resolve(Container.get('piso5x5Vazio')));
        
        let mapaServiceInstance = Container.get("MapaService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, "checkAuth").returns(Result.ok<void>());
        const mapaController = new MapaController(mapaServiceInstance as IMapaService, authServiceInstance as IAuthService);
        
        let result = await mapaController.carregarMapa(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, body as ICarregarMapaDTO);
    });

    it('Exportar mapa retorna exportarMapaDTO', async function(){
        let body = {
        }

        let exportarMapaDTO : IExportarMapaDTO = {
            codigoEdificio: "ED01",
            numeroPiso: 0,
            matriz: [
                [" ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " "],
            ],
            texturaChao: "/assets/floor.jpg",
            texturaParede: "/assets/wall.jpg",
            modeloPorta: "/assets/door.glb",
            modeloElevador: "/assets/elevator.glb",
        }

        let req: Partial<Request> = {};
        req.query = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let mapaServiceInstance = Container.get("MapaService");
        sinon.stub(mapaServiceInstance, "exportarMapa").returns(Promise.resolve(Result.ok<IExportarMapaDTO>(exportarMapaDTO)));
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, "checkAuth").returns(Result.ok<void>());
        const mapaController = new MapaController(mapaServiceInstance as IMapaService, authServiceInstance as IAuthService);
        await mapaController.exportarMapa(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            codigoEdificio: "ED01",
            matriz: [[" ", " ", " ", " ", " ", " "], [" ", " ", " ", " ", " ", " "], [" ", " ", " ", " ", " ", " "]],
            modeloElevador: "/assets/elevator.glb",
            modeloPorta: "/assets/door.glb",
            numeroPiso: 0,
            texturaChao: "/assets/floor.jpg",
            texturaParede: "/assets/wall.jpg"
          }));
    });

    it('MapaController + MapaService exportarMapa', async function(){
        let body = {
            codEdificio: "ED01",
            numPiso: "0",
        }

        let exportarMapaDTO : IExportarMapaDTO = {
            codigoEdificio: "ED01",
            numeroPiso: 0,
            matriz: [
                [" ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " "],
            ],
            texturaChao: "/assets/floor.jpg",
            texturaParede: "/assets/wall.jpg",
        }
        let edificioProps : any = {
            nome: Nome.create('ED01 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [Container.get('piso5x5')],
        };

        let req: Partial<Request> = {};
        req.query = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let mapaServiceInstance = Container.get("MapaService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, "checkAuth").returns(Result.ok<void>());

        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;

        let edificio = Edificio.create(edificioProps, Codigo.create(exportarMapaDTO.codigoEdificio).getValue()).getValue();
        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(edificio));


        const mapaController = new MapaController(mapaServiceInstance as IMapaService, authServiceInstance as IAuthService);
        await mapaController.exportarMapa(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            codigoEdificio: "ED01",
            elevador: { orientacao: "Norte", xCoord: 3, yCoord: 3 },
            matriz: [["NorteOeste", "Oeste", "Oeste", "NorteOeste", "Oeste", "Norte"], ["PortaNorte", " ", " ", "Norte", " ", "Norte"], ["Norte", " ", " ", "Norte", " ", "Norte"], ["NorteOeste", "Oeste", "Oeste", "Elevador", " ", "Norte"], ["Norte", " ", " ", " ", " ", "Norte"], ["Oeste", "Oeste", "Oeste", "Passagem", "Passagem", " "]],
            modeloElevador: "assets/elevator.glb",
            modeloPorta: "assets/door.glb",
            numeroPiso: 0,
            passagens: [{ abcissaA: 5, abcissaB: 5, id: 1, ordenadaA: 3, ordenadaB: 4, orientacao: "Oeste" }],
            salas: [{
                abcissaA: 0,
                abcissaB: 2,
                abcissaPorta: 1,
                nome: "sala1",
                ordenadaA: 0,
                ordenadaB: 2,
                ordenadaPorta: 0,
                orientacaoPorta: "Norte"
              }],
            posicaoInicialRobo: { x: 1, y: 4 },
            texturaChao: "assets/ground.jpg",
            texturaParede: "assets/wall.jpg"
        }));
    });

    it('exportarMapaAtravesDeUmaPassagemEPiso retorna exportarMapaDTO', async function(){
        let body = {
        }

        let exportarMapaDTO : IExportarMapaDTO = {
            codigoEdificio: "ED01",
            numeroPiso: 0,
            matriz: [
                [" ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " "],
            ],
            texturaChao: "/assets/floor.jpg",
            texturaParede: "/assets/wall.jpg",
            modeloPorta: "/assets/door.glb",
            modeloElevador: "/assets/elevator.glb",
        }

        let req: Partial<Request> = {};
        req.query = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let mapaServiceInstance = Container.get("MapaService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, "checkAuth").returns(Result.ok<void>());
        sinon.stub(mapaServiceInstance, "exportarMapaAtravesDeUmaPassagemEPiso").returns(Promise.resolve(Result.ok<IExportarMapaDTO>(exportarMapaDTO)));

        const mapaController = new MapaController(mapaServiceInstance as IMapaService, authServiceInstance as IAuthService);
        await mapaController.exportarMapaAtravesDeUmaPassagemEPiso(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            codigoEdificio: "ED01",
            matriz: [[" ", " ", " ", " ", " ", " "], [" ", " ", " ", " ", " ", " "], [" ", " ", " ", " ", " ", " "]],
            modeloElevador: "/assets/elevator.glb",
            modeloPorta: "/assets/door.glb",
            numeroPiso: 0,
            texturaChao: "/assets/floor.jpg",
            texturaParede: "/assets/wall.jpg"
          }));
    });
});