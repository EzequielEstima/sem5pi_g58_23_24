/*
import { describe } from "node:test";
import * as sinon from "sinon";
import { Container } from "typedi";
import { Response,Request, NextFunction } from "express";
import PontoController from "../../src/controllers/ImplControllers/PontoController";
import ICarregarMapaDTO from "../../src/dto/ICarregarMapaDTO";
import IPontoService from "../../src/services/IServices/IPontoService";
import { Result } from "../../src/core/logic/Result";
import { Piso } from "../../src/domain/piso/Piso";
import { Elevador } from "../../src/domain/elevador/Elevador";
import { MarcaElevador } from "../../src/domain/elevador/MarcaElevador";
import { ModeloElevador } from "../../src/domain/elevador/ModeloElevador";
import { NumeroSerieElevador } from "../../src/domain/elevador/NumeroSerieElevador";
import { DescricaoElevador } from "../../src/domain/elevador/DescricaoElevador";
import { IdElevador } from "../../src/domain/elevador/IdElevador";
import { Ponto } from "../../src/domain/ponto/Ponto";
import { IdPonto } from "../../src/domain/ponto/IdPonto";
import { TipoPonto } from "../../src/domain/ponto/TipoPonto";
import { Coordenadas } from "../../src/domain/ponto/Coordenadas";
import { DescricaoPiso } from "../../src/domain/piso/DescricaoPiso";
import { IdPiso } from "../../src/domain/piso/IdPiso";
import { NumeroPiso } from "../../src/domain/piso/NumeroPiso";
import { Nome } from "../../src/domain/edificio/Nome";
import { Dimensao } from "../../src/domain/edificio/Dimensao";
import { Edificio } from "../../src/domain/edificio/Edificio";
import { Codigo } from "../../src/domain/edificio/Codigo";
import Categorizacao from "../../src/domain/sala/CategorizacaoSala";
import DescricaoSala from "../../src/domain/sala/DescricaoSala";
import { Sala } from "../../src/domain/sala/Sala";
import NomeSala from "../../src/domain/sala/NomeSala";
import { Passagem } from "../../src/domain/passagem/Passagem";
import { IdPassagem } from "../../src/domain/passagem/IdPassagem";


describe('PontoController', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        this.timeout(20000);
        Container.reset();

        
        let pontoSchemaInstance = require('../../src/persistence/schemas/PontoSchema').default;
        Container.set("PontoSchema", pontoSchemaInstance);
        
        let pontoRepoClass = require('../../src/repos/PontoRepo').default;
        let pontoRepoInstance = Container.get(pontoRepoClass);
        Container.set("PontoRepo", pontoRepoInstance);
        
        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);
        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);
        
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
        
        let pisoSchemaInstance = require('../../src/persistence/schemas/PisoSchema').default;
        Container.set("PisoSchema", pisoSchemaInstance);
        let pisoRepoClass = require('../../src/repos/PisoRepo').default;
        let pisoRepoInstance = Container.get(pisoRepoClass);
        Container.set("PisoRepo", pisoRepoInstance);
        let pontoServiceClass = require('../../src/services/ImplServices/PontoService').default;
        let pontoServiceInstance = Container.get(pontoServiceClass);
        Container.set("PontoService", pontoServiceInstance);


        let pontoArray5x5  : Ponto[][] = [];
		for(let i = 0; i < 5; i++){
			pontoArray5x5[i] = [];
			for(let j = 0; j < 5; j++){
				let idPonto = IdPonto.create(i*5 + j + 1).getValue();
				let tipoPonto = TipoPonto.create(" ").getValue();
				let coordenadas = Coordenadas.create({abscissa: i , ordenada: j }).getValue();
				pontoArray5x5[i][j] = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
			}
		}

        let pontoArray5x5_2  : Ponto[][] = [];
		for(let i = 0; i < 5; i++){
			pontoArray5x5_2[i] = [];
			for(let j = 0; j < 5; j++){
				let idPonto = IdPonto.create(i*5 + j + 1 + 30).getValue();
				let tipoPonto = TipoPonto.create(" ").getValue();
				let coordenadas = Coordenadas.create({abscissa: i , ordenada: j }).getValue();
				pontoArray5x5_2[i][j] = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
			}
		}

        let pontoArray5x5_3  : Ponto[][] = [];
		for(let i = 0; i < 5; i++){
			pontoArray5x5_3[i] = [];
			for(let j = 0; j < 5; j++){
				let idPonto = IdPonto.create(i*5 + j + 1 + 90).getValue();
				let tipoPonto = TipoPonto.create(" ").getValue();
				let coordenadas = Coordenadas.create({abscissa: i , ordenada: j }).getValue();
				pontoArray5x5_3[i][j] = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
			}
		}
        
        let pontoArray5x5Vazio : Ponto[][] = [];
		for(let i = 0; i < 5; i++){
			pontoArray5x5Vazio[i] = [];
			for(let j = 0; j < 5; j++){
				let idPonto = IdPonto.create(i*5 + j + 1).getValue();
				let tipoPonto = TipoPonto.create(" ").getValue();
				let coordenadas = Coordenadas.create({abscissa: i , ordenada: j }).getValue();
				pontoArray5x5Vazio[i][j] = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
			}
		}

        
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

		pontoArray5x5[0][0].toParedeNorteOeste();
		pontoArray5x5[1][0].toParedeNorte();
		pontoArray5x5[2][0].toParedeNorte();
		pontoArray5x5[3][0].toParedeNorte();
		pontoArray5x5[4][0].toParedeOeste();
		pontoArray5x5[0][1].toParedeOeste();
		pontoArray5x5[0][2].toParedeOeste();
		pontoArray5x5[0][3].toParedeOeste();
		pontoArray5x5[0][4].toParedeNorte();
		pontoArray5x5[4][1].toParedeOeste();
		pontoArray5x5[4][2].toParedeOeste();
		pontoArray5x5[4][3].toParedeOeste();
		pontoArray5x5[1][4].toParedeNorte();
		pontoArray5x5[2][4].toParedeNorte();
		pontoArray5x5[3][4].toParedeNorte();
        
        pontoArray5x5_2[0][0].toParedeNorteOeste();
		pontoArray5x5_2[1][0].toParedeNorte();
		pontoArray5x5_2[2][0].toParedeNorte();
		pontoArray5x5_2[3][0].toParedeNorte();
		pontoArray5x5_2[4][0].toParedeOeste();
		pontoArray5x5_2[0][1].toParedeOeste();
		pontoArray5x5_2[0][2].toParedeOeste();
		pontoArray5x5_2[0][3].toParedeOeste();
		pontoArray5x5_2[0][4].toParedeNorte();
		pontoArray5x5_2[4][1].toParedeOeste();
		pontoArray5x5_2[4][2].toParedeOeste();
		pontoArray5x5_2[4][3].toParedeOeste();
		pontoArray5x5_2[1][4].toParedeNorte();
		pontoArray5x5_2[2][4].toParedeNorte();
		pontoArray5x5_2[3][4].toParedeNorte();

        pontoArray5x5_3[0][0].toParedeNorteOeste();
		pontoArray5x5_3[1][0].toParedeNorte();
		pontoArray5x5_3[2][0].toParedeNorte();
		pontoArray5x5_3[3][0].toParedeNorte();
		pontoArray5x5_3[4][0].toParedeOeste();
		pontoArray5x5_3[0][1].toParedeOeste();
		pontoArray5x5_3[0][2].toParedeOeste();
		pontoArray5x5_3[0][3].toParedeOeste();
		pontoArray5x5_3[0][4].toParedeNorte();
		pontoArray5x5_3[4][1].toParedeOeste();
		pontoArray5x5_3[4][2].toParedeOeste();
		pontoArray5x5_3[4][3].toParedeOeste();
		pontoArray5x5_3[1][4].toParedeNorte();
		pontoArray5x5_3[2][4].toParedeNorte();
		pontoArray5x5_3[3][4].toParedeNorte();

		let piso5x5 = Piso.create({
			numeroPiso: numeroPiso,
			descricaoPiso: descricaoPiso,
			mapa: pontoArray5x5,
		}, idPiso).getValue();
		Container.set ('piso5x5',piso5x5);

        let piso5x5_2 = Piso.create({
            numeroPiso: numeroPiso2,
            descricaoPiso: descricaoPiso2,
            mapa: pontoArray5x5_2,
        }, idPiso2).getValue();
        Container.set ('piso5x5_2',piso5x5_2);

        let piso5x5_3 = Piso.create({
            numeroPiso: numeroPiso3,
            descricaoPiso: descricaoPiso3,
            mapa: pontoArray5x5_3,
        }, idPiso3).getValue();
        Container.set ('piso5x5_3',piso5x5_3);

        let piso5x5Vazio = Piso.create({
			numeroPiso: numeroPiso4,
			descricaoPiso: descricaoPiso4,
			mapa: pontoArray5x5Vazio,
		}, idPiso4).getValue();
		Container.set ('piso5x5Vazio',piso5x5Vazio);


        let elevador =  Elevador.create({
            pisosServidos: [piso5x5Vazio, piso5x5_2],
            marca: MarcaElevador.create("Marca").getValue(),
            modelo: ModeloElevador.create("Modelo").getValue(),
            numeroSerie : NumeroSerieElevador.create("NumeroSerie").getValue(),
            descricao : DescricaoElevador.create("Descricao").getValue(),
            pontos: [],
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

        let pontoServiceInstance = Container.get("PontoService");
        sinon.stub(pontoServiceInstance, "carregarMapa").returns(Promise.resolve(Result.ok<ICarregarMapaDTO>(body as ICarregarMapaDTO)));

        const pontoController = new PontoController(pontoServiceInstance as IPontoService);
        await pontoController.carregarMapa(req as Request, res as Response, next as NextFunction);

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
        
        console.log(body as ICarregarMapaDTO);
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
            listaPontos : [undefined, undefined],
        }
        let sala = Sala.create(salaProps, NomeSala.create(body.salas[0].nome).getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo");
        let salaRepoInstance = Container.get("SalaRepo");
        let passagemRepoInstance = Container.get("PassagemRepo");
        let pontoRepoInstance = Container.get("PontoRepo");
        let elevadorRepoInstance = Container.get("ElevadorRepo");

        let passagemProps : any = {
            listaPontos : [undefined, undefined, undefined, undefined],
            pisoA : edificio.returnListaPisos()[0],
            pisoB : Container.get('piso5x5Vazio'),
        }
        let passagem = Passagem.create(passagemProps, IdPassagem.create(1).getValue()).getValue();

        let pontoStub = Ponto.create({coordenadas: Coordenadas.create({abscissa: 5 , ordenada: 2 }).getValue(),tipoPonto:TipoPonto.create(" ").getValue()},IdPonto.create(1).getValue()).getValue();


        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(edificio));
        sinon.stub(salaRepoInstance, 'findSalasByPiso').returns(Promise.resolve([sala]));
        sinon.stub(passagemRepoInstance, 'listarPassagensComUmPiso').returns(Promise.resolve([passagem]));
        sinon.stub(pontoRepoInstance, 'save').returns(Promise.resolve(pontoStub));
        sinon.stub(elevadorRepoInstance, 'save').returns(Promise.resolve(Container.get('elevador')));
        sinon.stub(salaRepoInstance, 'save').returns(Promise.resolve(sala));
        sinon.stub(passagemRepoInstance, 'save').returns(Promise.resolve(passagem));
        
        let pontoServiceInstance = Container.get("PontoService");
        const pontoController = new PontoController(pontoServiceInstance as IPontoService);
        
        let result = await pontoController.carregarMapa(req as Request, res as Response, next as NextFunction);

        sinon.assert.calledOnce(res.status as sinon.SinonSpy);
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, body as ICarregarMapaDTO);
    });

});
*/