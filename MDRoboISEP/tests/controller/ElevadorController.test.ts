import * as sinon from 'sinon';
import 'mocha';
import "reflect-metadata";
import { expect } from "chai";
import { Container } from 'typedi';
import {NextFunction, Request, Response} from 'express';
import { Result } from '../../src/core/logic/Result';
import ICriarElevadorDTO from '../../src/dto/ICriarElevadorDTO';
import IElevadorService from '../../src/services/IServices/IElevadorService';
import ElevadorController from '../../src/controllers/ImplControllers/ElevadorController';
import { Codigo } from '../../src/domain/edificio/Codigo';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { Edificio } from '../../src/domain/edificio/Edificio';
import { Nome } from '../../src/domain/edificio/Nome';
import { DescricaoPiso } from '../../src/domain/piso/DescricaoPiso';
import { IdPiso } from '../../src/domain/piso/IdPiso';
import { NumeroPiso } from '../../src/domain/piso/NumeroPiso';
import { Piso } from '../../src/domain/piso/Piso';
import { DescricaoElevador } from '../../src/domain/elevador/DescricaoElevador';
import { Elevador } from '../../src/domain/elevador/Elevador';
import { IdElevador } from '../../src/domain/elevador/IdElevador';
import { MarcaElevador } from '../../src/domain/elevador/MarcaElevador';
import { ModeloElevador } from '../../src/domain/elevador/ModeloElevador';
import { NumeroSerieElevador } from '../../src/domain/elevador/NumeroSerieElevador';
import IElevadorDTO from '../../src/dto/IElevadorDTO';
import IAuthService from '../../src/services/IServices/IAuthService';


describe('ElevadorController', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        this.timeout(300000);
        Container.reset();

        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(2,2).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [],
        };
        
        const edificioComElevador = Edificio.create(edificioProps,Codigo.create('ED01').getValue()).getValue();


        let edificioProps2 : any = {
            nome: Nome.create('Edificio B').getValue(),
            dimensao:Dimensao.create(2,2).getValue(),
            descricao:DescricaoEdificio.create('Edificio B').getValue(),
            listaPisos: [],
        };

        const edificioSemElevador = Edificio.create(edificioProps2,Codigo.create('ED02').getValue()).getValue();


        // Criar 2 pisos
        let pisosServidos: Piso[] = [];
        
        for (let i = 0; i < 2; i++){
            //Criar o mapa
            let mapa;
                
    
            let piso = Piso.create({
                numeroPiso:  NumeroPiso.create(i+1).getValue(),
                descricaoPiso: DescricaoPiso.create("Ola").getValue(),
                mapa: mapa,
            }, IdPiso.create(i+1).getValue()).getValue();

            // adicionar para a criação do elevador
            pisosServidos.push(piso);
            // adiconar ao edifício
        }
        edificioComElevador.addPiso(pisosServidos[0]);
        edificioComElevador.addPiso(pisosServidos[1]);
        edificioSemElevador.addPiso(pisosServidos[0]);
        edificioSemElevador.addPiso(pisosServidos[1]);

        //Criar elevador
        let idElevador = IdElevador.create(1).getValue();
        let marcaElevador = MarcaElevador.create('123').getValue();
        let modeloElevador = ModeloElevador.create('123').getValue();
        let numeroSerieElevador = NumeroSerieElevador.create('123').getValue();
        let descricaoElevador = DescricaoElevador.create('123').getValue();

        let elevador =  Elevador.create({
            pisosServidos: pisosServidos,
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, idElevador).getValue()
        

        edificioComElevador.adicionarElevador(elevador);

        Container.set("edificioComElevador", edificioComElevador)
        Container.set("edificioSemElevador", edificioSemElevador)

        //Schema
        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let elevadorSchemaInstance = require('../../src/persistence/schemas/ElevadorSchema').default;
        Container.set("ElevadorSchema", elevadorSchemaInstance);

        let pontoSchemaInstance = require('../../src/persistence/schemas/PontoSchema').default;
        Container.set("PontoSchema", pontoSchemaInstance);
        
        //Repo
        let elevadorRepoClass = require('../../src/repos/ElevadorRepo').default;
        let elevadorRepoInstance = Container.get(elevadorRepoClass);
        Container.set("ElevadorRepo", elevadorRepoInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

        //Service
        let elevadorServiceClass = require('../../src/services/ImplServices/ElevadorService').default;
        let elevadorServiceInstance = Container.get(elevadorServiceClass);
        Container.set("ElevadorService", elevadorServiceInstance);

        let authServiceClass = require('../../src/services/ImplServices/AuthService').default;
        let authServiceInstance = Container.get(authServiceClass);
        Container.set("AuthService", authServiceInstance);
    });
    
    afterEach(function() {
        sinon.restore();
        sandbox.restore();
    });

    it ('criarElevador retorna elevador JSON', async function(){

        let body = {
            "edificio": "cod",
            "pisosServidos": [1,2],
            "marca": "marca",
            "modelo": "modelo",
            "numeroSerie": "123",
            "descricao": "desc"
        };

        let req : Partial<Request> = {};
        req.body = body;

        let res:Partial<Response> =  {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let elevadorServicoInstance = Container.get("ElevadorService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());

        sinon.stub(elevadorServicoInstance, 'criarElevador').returns(Promise.resolve(Result.ok<ICriarElevadorDTO>(body as ICriarElevadorDTO)))

        const elevadorController = new ElevadorController(elevadorServicoInstance as IElevadorService, authServiceInstance as IAuthService)

        await elevadorController.criarElevador(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            edificio: "cod",
            pisosServidos: [1,2],
            marca: "marca",
            modelo: "modelo",
            numeroSerie: "123",
            descricao: "desc"
        }));
    });


    it ('Teste integração ElevadorController + ElevadorService criarElevador', async function(){

        let body = {
            "edificio": "cod",
            "pisosServidos": [1,2],
            "marca": "marca",
            "modelo": "modelo",
            "numeroSerie": "123",
            "descricao": "desc"
        };

        let req : Partial<Request> = {};
        req.body = body;

        let res:Partial<Response> =  {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let elevadorServiceInstance = Container.get("ElevadorService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioSemElevador")));
        sinon.stub(elevadorRepoInstance, "getMaxId").returns(Promise.resolve(1));
        sinon.stub(elevadorRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(edificioRepoInstance, "save").returns(Promise.resolve(null));
        
        const elevadorServiceSpy = sinon.spy(elevadorServiceInstance,"criarElevador")
        const elevadorController = new ElevadorController(elevadorServiceInstance as IElevadorService, authServiceInstance as IAuthService)

        let answer = await elevadorController.criarElevador(<Request>req, <Response>res, <NextFunction>next);
        
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(elevadorServiceSpy)
        sinon.assert.calledWith(elevadorServiceSpy, body);
        sinon.assert.calledWith(res.json, sinon.match({
            edificio: "cod",
            pisosServidos: [1,2],
            marca: "marca",
            modelo: "modelo",
            numeroSerie: "123",
            descricao: "desc"
        }));
    });


    it ('editarElevador retorna elevador JSON', async function(){

        let body = {
            "edificio": "cod",
            "pisosServidos": [1,2],
            "marca": "marca1",
            "modelo": "modelo1",
            "numeroSerie": "1231",
            "descricao": "desc1"
        };

        let req : Partial<Request> = {};
        req.body = body;

        let res:Partial<Response> =  {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let elevadorServicoInstance = Container.get("ElevadorService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());

        sinon.stub(elevadorServicoInstance, 'editarElevador').returns(Promise.resolve(Result.ok<ICriarElevadorDTO>(body as ICriarElevadorDTO)))

        const elevadorController = new ElevadorController(elevadorServicoInstance as IElevadorService, authServiceInstance as IAuthService)

        let answer = await elevadorController.editarElevador(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            edificio: "cod",
            pisosServidos: [1,2],
            marca: "marca1",
            modelo: "modelo1",
            numeroSerie: "1231",
            descricao: "desc1"
        }));
    });

    it ('Teste integração ElevadorController + ElevadorService editarElevador', async function(){

        let body = {
            "edificio": "cod",
            "pisosServidos": [1,2],
            "marca": "marca1",
            "modelo": "modelo1",
            "numeroSerie": "1231",
            "descricao": "desc1"
        };

        let req : Partial<Request> = {};
        req.body = body;

        let res:Partial<Response> =  {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");
        let elevadorServiceInstance = Container.get("ElevadorService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificioComElevador")));
        sinon.stub(elevadorRepoInstance, "save").returns(Promise.resolve(null))
        
        const elevadorServiceSpy = sinon.spy(elevadorServiceInstance,"editarElevador")
        const elevadorController = new ElevadorController(elevadorServiceInstance as IElevadorService, authServiceInstance as IAuthService)

        let answer = await elevadorController.editarElevador(<Request>req, <Response>res, <NextFunction>next);
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(elevadorServiceSpy)
        sinon.assert.calledWith(elevadorServiceSpy, body);
        sinon.assert.calledWith(res.json, sinon.match({
            edificio: "cod",
            pisosServidos: [1,2],
            marca: "marca1",
            modelo: "modelo1",
            numeroSerie: "1231",
            descricao: "desc1"
        }));
    });

    it('listarElevadoresDoEdificio retorna elevador JSON', async function() {
        
        let body = {
        };

        const elevadorDTO = {
            id: 1,
            marca: 'marca1',
            modelo: "modelo1",
            numeroSerie: "numeroSerie1",
            descricao: "descricao1",
        } as IElevadorDTO;

        let req: Partial<Request> = {};
        req.query = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let elevadorServiceInstance = Container.get("ElevadorService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());

        sinon.stub(elevadorServiceInstance, 'listarElevadoresDoEdificio').returns(Promise.resolve(Result.ok<IElevadorDTO>(elevadorDTO)));

        const elevadorController = new ElevadorController(elevadorServiceInstance as IElevadorService, authServiceInstance as IAuthService);
        
        await elevadorController.listarElevadoresDoEdificio(<Request>req, <Response>res, <NextFunction>next);
        
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            id: 1,
            marca: 'marca1',
            modelo: "modelo1",
            numeroSerie: "numeroSerie1",
            descricao: "descricao1",
        }));
    });

    it('listarElevadoresDoEdificio retorna elevador JSON', async function() {
        
        let body = {
        };

        let req: Partial<Request> = {};
        req.query = body;

        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        let next: Partial<NextFunction> = () => {};

        let elevadorServiceInstance = Container.get("ElevadorService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, 'checkAuth').returns(Result.ok<void>());
        let edificioRepoInstance = Container.get("EdificioRepo");

        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(Container.get("edificioComElevador")));

        const elevadorController = new ElevadorController(elevadorServiceInstance as IElevadorService, authServiceInstance as IAuthService);
        
        await elevadorController.listarElevadoresDoEdificio(<Request>req, <Response>res, <NextFunction>next);
        
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            id: 1,
            marca: '123',
            modelo: "123",
            numeroSerie: "123",
            descricao: "123",
        }));
    });
});