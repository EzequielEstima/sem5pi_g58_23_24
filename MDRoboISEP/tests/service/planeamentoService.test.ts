import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';import { Nome } from "../../src/domain/edificio/Nome";
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
import PlaneamentoService  from "../../src/services/ImplServices/PlaneamentoService";
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
import { Elevador } from "../../src/domain/elevador/Elevador";
import { IdElevador } from "../../src/domain/elevador/IdElevador";
import { DescricaoElevador } from "../../src/domain/elevador/DescricaoElevador";
import { MarcaElevador } from "../../src/domain/elevador/MarcaElevador";
import { ModeloElevador } from "../../src/domain/elevador/ModeloElevador";
import { NumeroSerieElevador } from "../../src/domain/elevador/NumeroSerieElevador";

describe ('PlaneamentoService', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        Container.reset();
        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

        let salaSchemaInstance = require('../../src/persistence/schemas/SalaSchema').default;
        Container.set("salaSchema", salaSchemaInstance);
        let salaRepoClass = require('../../src/repos/SalaRepo').default;
        let salaRepoInstance = Container.get(salaRepoClass);
        Container.set("salaRepo", salaRepoInstance);

    });

    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it ('encontrarCaminhoEntreDuasSalas', async () => {
        let edificioRepoInstance = Container.get("EdificioRepo");
        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let pisoRepoInstance = Container.get("PisoRepo");
        let mapaRepoInstance = Container.get("MapaRepo");
        let salaRepoInstance = Container.get("SalaRepo");
        let passagemRepoInstance = Container.get("PassagemRepo");

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

        let stub = sinon.stub(edificioRepoInstance, "findByPiso");
        stub.onCall(0).resolves(edificioA);
        stub.onCall(1).resolves(edificioB);

        let stub2 = sinon.stub(salaRepoInstance, "findByDomainId");
        stub2.onCall(0).resolves(salaOrError.getValue());
        stub2.onCall(1).resolves(salaOrError2.getValue());
        
        const edificioService =  new EdificioService
        (
            edificioRepoInstance as IEdificioRepo, pisoRepoInstance as IPisoRepo,
            elevadorRepoInstance as IElevadorRepo, salaRepoInstance as ISalaRepo,
            passagemRepoInstance as IPassagemRepo, mapaRepoInstance as IMapaRepo
        );
        const planeamentoServiceClass = new PlaneamentoService(salaRepoInstance as ISalaRepo, edificioService as IEdificioService, edificioRepoInstance as IEdificioRepo);

        const mockResponseData: IPlaneamentoCaminhosDTO = {
            caminho: "ED01",
            custo: "ED02",
            edificios: "ED03",
            ligacoes: "ED04",
        };

        let mock : Promise<Result<IPlaneamentoCaminhosDTO>>;
        mock = new Promise((resolve, reject) => {
            resolve(Result.ok<IPlaneamentoCaminhosDTO>(mockResponseData));
        });
        sinon.stub(edificioService, "getInformacaoPlaneamento").resolves(mock);

        let result = await planeamentoServiceClass.encontrarCaminhosEntreEdificios("HAHAHA", "HAHAH2");

        expect(result.getValue()).equal(mockResponseData.caminho)
    });


    it ('integracao encontrarCaminhoEntreDuasSalas + getInformacaoPlaneamento', async () => {
        let edificioRepoInstance = Container.get("EdificioRepo");
        let elevadorRepoInstance = Container.get("ElevadorRepo");
        let pisoRepoInstance = Container.get("PisoRepo");
        let mapaRepoInstance = Container.get("MapaRepo");
        let salaRepoInstance = Container.get("SalaRepo");
        let passagemRepoInstance = Container.get("PassagemRepo");

        let idElevador = IdElevador.create(1).getValue();
        let marcaElevador = MarcaElevador.create('123').getValue();
        let modeloElevador = ModeloElevador.create('123').getValue();
        let numeroSerieElevador = NumeroSerieElevador.create('123').getValue();
        let descricaoElevador = DescricaoElevador.create('123').getValue();


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
            mapa: mapaCompleto1,
        }, IdPiso.create(2).getValue()).getValue();

        let piso5x5_3 = Piso.create({
            numeroPiso: NumeroPiso.create(1).getValue(),
            descricaoPiso: DescricaoPiso.create("ola").getValue(),
            mapa: mapaCompleto2,
        }, IdPiso.create(3).getValue()).getValue();

        let piso5x5_4 = Piso.create({
            numeroPiso: NumeroPiso.create(2).getValue(),
            descricaoPiso: DescricaoPiso.create("ola").getValue(),
            mapa: mapaCompleto2,
        }, IdPiso.create(4).getValue()).getValue();

        let elevadorOrError =  Elevador.create({
            pisosServidos: [piso5x5, piso5x5_2],
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, IdElevador.create(1).getValue()).getValue();


        let elevador = Elevador.create({
            pisosServidos: [piso5x5_3, piso5x5_4],
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, IdElevador.create(2).getValue()).getValue();

        edificioA.addPiso(piso5x5);
        edificioB.addPiso(piso5x5_3);
        edificioA.addPiso(piso5x5_2);
        edificioB.addPiso(piso5x5_4);

        edificioA.adicionarElevador(elevadorOrError);
        edificioB.adicionarElevador(elevador);

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
            piso: piso5x5_3,
        }, nomeSalaoOrError2);

        let stub = sinon.stub(edificioRepoInstance, "findByPiso");
        stub.onCall(0).resolves(edificioA);
        stub.onCall(1).resolves(edificioB);

        let stub2 = sinon.stub(salaRepoInstance, "findByDomainId");
        stub2.onCall(0).resolves(salaOrError.getValue());
        stub2.onCall(1).resolves(salaOrError2.getValue());
        
        const edificioService =  new EdificioService
        (
            edificioRepoInstance as IEdificioRepo, pisoRepoInstance as IPisoRepo,
            elevadorRepoInstance as IElevadorRepo, salaRepoInstance as ISalaRepo,
            passagemRepoInstance as IPassagemRepo, mapaRepoInstance as IMapaRepo
        );
        const planeamentoServiceClass = new PlaneamentoService(salaRepoInstance as ISalaRepo, edificioService as IEdificioService, edificioRepoInstance as IEdificioRepo);

        const mockResponseData: IPlaneamentoCaminhosDTO = {
            caminho: "ED01",
            custo: "ED02",
            edificios: "ED03",
            ligacoes: "ED04",
        };

        let mock : Promise<Result<IPlaneamentoCaminhosDTO>>;
        mock = new Promise((resolve, reject) => {
            resolve(Result.ok<IPlaneamentoCaminhosDTO>(mockResponseData));
        });

        sinon.stub(edificioService, "comunicaoComPlaneamento").resolves(mock);

        let passagemOuErro = Passagem.create({
            pisoA: piso5x5,
            pisoB: piso5x5_2,
        }, IdPassagem.create(1).getValue()).getValue();

        sinon.stub(edificioRepoInstance, "getAllEdificios").returns(Promise.resolve([edificioA, edificioB]));
        sinon.stub(passagemRepoInstance, "findAll").returns(Promise.resolve([passagemOuErro]));
        stub.onCall(2).returns(Promise.resolve(edificioA));
        stub.onCall(3).returns(Promise.resolve(edificioB));

        let result = await planeamentoServiceClass.encontrarCaminhosEntreEdificios("HAHAHA", "HAHAH2");

        expect(result.getValue()).equal(mockResponseData.caminho)
    });

});