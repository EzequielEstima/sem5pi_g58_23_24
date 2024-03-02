import { Response, Request, NextFunction } from 'express'; import * as sinon from 'sinon';

import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import { Container } from 'typedi'; import { Nome } from "../../src/domain/edificio/Nome";
import { Codigo } from "../../src/domain/edificio/Codigo";
import { DescricaoEdificio } from "../../src/domain/edificio/DescricaoEdificio";
import { Dimensao } from "../../src/domain/edificio/Dimensao";
import { Edificio } from "../../src/domain/edificio/Edificio";
import { IdMapa } from "../../src/domain/mapa/IdMapa";
import { Mapa } from "../../src/domain/mapa/Mapa";
import { TipoPonto } from "../../src/domain/mapa/TipoPonto";
import { DescricaoPiso } from "../../src/domain/piso/DescricaoPiso";
import { IdPiso } from "../../src/domain/piso/IdPiso";
import { NumeroPiso } from "../../src/domain/piso/NumeroPiso";
import { Piso } from "../../src/domain/piso/Piso";
import CategorizacaoSala from "../../src/domain/sala/CategorizacaoSala";
import DescricaoSala from "../../src/domain/sala/DescricaoSala";
import NomeSala from "../../src/domain/sala/NomeSala";
import { Sala } from "../../src/domain/sala/Sala";
import PlaneamentoService from "../../src/services/ImplServices/PlaneamentoService";
import IEdificioRepo from "../../src/services/IRepos/IEdificioRepo";
import IElevadorRepo from "../../src/services/IRepos/IElevadorRepo";
import IMapaRepo from "../../src/services/IRepos/IMapaRepo";
import IPassagemRepo from "../../src/services/IRepos/IPassagemRepo";
import IPisoRepo from "../../src/services/IRepos/IPisoRepo";
import ISalaRepo from "../../src/services/IRepos/ISalaRepo";
import EdificioService from "../../src/services/ImplServices/EdificioService";
import IEdificioService from "../../src/services/IServices/IEdificioService";
import IPlaneamentoCaminhosDTO from "../../src/dto/IPlaneamentoCaminhosDTO";
import { Result } from "../../src/core/logic/Result";
import { IdPassagem } from "../../src/domain/passagem/IdPassagem";
import { Passagem } from "../../src/domain/passagem/Passagem";
import IPlaneamentoService from '../../src/services/IServices/IPlaneamentoService';
import PlaneamentoController from '../../src/controllers/ImplControllers/PlaneamentoController';
import IAuthService from '../../src/services/IServices/IAuthService';

describe('PlaneamentoService', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        this.timeout(300000);
        Container.reset();
        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

        let pisoSchemaInstance = require('../../src/persistence/schemas/PisoSchema').default;
        Container.set("PisoSchema", pisoSchemaInstance);

        let pisoRepoClass = require('../../src/repos/PisoRepo').default;
        let pisoRepoInstance = Container.get(pisoRepoClass);
        Container.set("PisoRepo", pisoRepoInstance);

        let elevadorSchemaInstance = require('../../src/persistence/schemas/ElevadorSchema').default;
        Container.set("ElevadorSchema", elevadorSchemaInstance);

        let elevadorRepoClass = require('../../src/repos/ElevadorRepo').default;
        let elevadorRepoInstance = Container.get(elevadorRepoClass);
        Container.set("ElevadorRepo", elevadorRepoInstance);
        
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

        let mapaSchemaInstance = require('../../src/persistence/schemas/MapaSchema').default;
        Container.set("MapaSchema", mapaSchemaInstance);

        let mapaRepoClass = require('../../src/repos/MapaRepo').default;
        let mapaRepoInstance = Container.get(mapaRepoClass);
        Container.set("MapaRepo", mapaRepoInstance);

        let edificioServiceClass = require('../../src/services/ImplServices/EdificioService').default;
        let edificioServiceInstance = Container.get(edificioServiceClass);
        Container.set("EdificioService", edificioServiceInstance);

        let authServiceClass = require('../../src/services/ImplServices/AuthService').default;
        let authServiceInstance = Container.get(authServiceClass);
        Container.set("AuthService", authServiceInstance);

        let planeamentoServiceClass = require('../../src/services/ImplServices/PlaneamentoService').default;
        let planeamentoServiceInstance = Container.get(planeamentoServiceClass);
        Container.set("PlaneamentoService", planeamentoServiceInstance);

    });

    afterEach(function() {
        sinon.restore();
        sandbox.restore();
    });

    it('encontrarCaminhoEntreDuasSalas', async () => {


        let body = {
            salaInicial: "HAHAHA",
            salaFinal: "HAHAH2"
        };

        let req: Partial<Request> = {};
        req.query = body as any;
        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => { };

        let planeamentoServiceInstance = Container.get("PlaneamentoService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, "checkAuth").returns(Result.ok<void>());
        sinon.stub(planeamentoServiceInstance, "encontrarCaminhosEntreEdificios").resolves(Result.ok<String>("ED02"));

        let planeamentoController = new PlaneamentoController(planeamentoServiceInstance as IPlaneamentoService, authServiceInstance as IAuthService);

        await planeamentoController.encontrarCaminhosEntreEdificios(req as Request, res as Response, next as NextFunction);

        // Assert
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, "ED02");
    });

    it('integracao encontrarCaminhoEntreDuasSalas + PlaneamentoService', async () => {

        let edificioRepoInstance = Container.get("EdificioRepo");
        let salaRepoInstance = Container.get("SalaRepo");

        let edificioProps = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao: Dimensao.create(1, 1).getValue(),
            descricao: DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [],
        };

        let edificioA = Edificio.create(edificioProps, Codigo.create('ED01').getValue()).getValue();
        let edificioB = Edificio.create(edificioProps, Codigo.create('ED02').getValue()).getValue();

        let mapaTipoPonto: TipoPonto[][] = [];
        for (let i = 0; i <= 5; i++) {
            mapaTipoPonto[i] = [];
            for (let j = 0; j <= 5; j++) {
                mapaTipoPonto[i][j] = TipoPonto.create(" ").getValue();
            }
        }

        let mapaCompleto1 = Mapa.create({ mapa: mapaTipoPonto }, IdMapa.create(1).getValue()).getValue();
        let mapaCompleto2 = Mapa.create({ mapa: mapaTipoPonto }, IdMapa.create(2).getValue()).getValue();

        mapaCompleto1.carregarMapaComBermas();
        mapaCompleto1.criarPontosElevador(3, 3, "Norte");
        mapaCompleto1.carregarSalaMapa("HAHAHA", 0, 0, 2, 2, 1, 0, "Norte");
        mapaCompleto1.carregarPassagemMapa({ id: 1, abcissa: 5, ordenada: 3, orientacao: "Oeste" });
        mapaCompleto1.rodarMapa();

        mapaCompleto2.carregarMapaComBermas();
        mapaCompleto2.criarPontosElevador(3, 3, "Norte");
        mapaCompleto2.carregarSalaMapa("HAHAH2", 0, 0, 2, 2, 1, 0, "Norte");
        mapaCompleto2.carregarPassagemMapa({ id: 1, abcissa: 5, ordenada: 3, orientacao: "Oeste" });
        mapaCompleto2.rodarMapa();

        let piso5x5 = Piso.create({
            numeroPiso: NumeroPiso.create(1).getValue(),
            descricaoPiso: DescricaoPiso.create("ola").getValue(),
            mapa: mapaCompleto1,
        }, IdPiso.create(1).getValue()).getValue();

        let piso5x5_2 = Piso.create({
            numeroPiso: NumeroPiso.create(2).getValue(),
            descricaoPiso: DescricaoPiso.create("ola").getValue(),
            mapa: mapaCompleto2,
        }, IdPiso.create(2).getValue()).getValue();

        edificioA.addPiso(piso5x5);
        edificioB.addPiso(piso5x5_2);

        let categoriaOrError = CategorizacaoSala.create("Laboratorio").getValue();
        let descricaoOrError = DescricaoSala.create("Sala B300 - Laboratorio de Informatica").getValue();
        let nomeSalaoOrError = NomeSala.create("HAHAHA").getValue();

        let salaOrError = Sala.create({
            categoria: categoriaOrError,
            descricao: descricaoOrError,
            piso: piso5x5,
        }, nomeSalaoOrError);

        let nomeSalaoOrError2 = NomeSala.create("HAHAH2").getValue();
        let salaOrError2 = Sala.create({
            categoria: categoriaOrError,
            descricao: descricaoOrError,
            piso: piso5x5_2,
        }, nomeSalaoOrError2);

        let body = {
            salaInicial: "HAHAHA",
            salaFinal: "HAHAH2"
        };

        let req: Partial<Request> = {};
        req.query = body as any;
        let res: Partial<Response> = {
            status: sinon.spy(),
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => { };

        let planeamentoServiceInstance = Container.get("PlaneamentoService");
        let authServiceInstance = Container.get("AuthService");
        sinon.stub(authServiceInstance, "checkAuth").returns(Result.ok<void>());
        sinon.stub(planeamentoServiceInstance, "encontrarCaminhosEntreEdificios").resolves(Result.ok<String>("ED02"));

        let stub = sinon.stub(edificioRepoInstance, "findByPiso");
        stub.onCall(0).resolves(edificioA);
        stub.onCall(1).resolves(edificioB);

        let stub2 = sinon.stub(salaRepoInstance, "findByDomainId");
        stub2.onCall(0).resolves(salaOrError.getValue());
        stub2.onCall(1).resolves(salaOrError2.getValue());

        let planeamentoController = new PlaneamentoController(planeamentoServiceInstance as IPlaneamentoService, authServiceInstance as IAuthService);

        await planeamentoController.encontrarCaminhosEntreEdificios(req as Request, res as Response, next as NextFunction);

        // Assert
        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, "ED02");
    });

});