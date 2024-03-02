import { expect } from 'chai';
import * as sinon from 'sinon';
import Container from 'typedi';
import { Nome } from '../../src/domain/edificio/Nome';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { Edificio } from '../../src/domain/edificio/Edificio';
import { Codigo } from '../../src/domain/edificio/Codigo';
import { Piso } from '../../src/domain/piso/Piso';
import { DescricaoPiso } from '../../src/domain/piso/DescricaoPiso';
import { IdPiso } from '../../src/domain/piso/IdPiso';
import { NumeroPiso } from '../../src/domain/piso/NumeroPiso';
import Categorizacao from '../../src/domain/sala/CategorizacaoSala';
import DescricaoSala from '../../src/domain/sala/DescricaoSala';
import { Sala } from '../../src/domain/sala/Sala';
import NomeSala from '../../src/domain/sala/NomeSala';
import { Passagem } from '../../src/domain/passagem/Passagem';
import { IdPassagem } from '../../src/domain/passagem/IdPassagem';
import { Mapa } from '../../src/domain/mapa/Mapa';
import MapaService from '../../src/services/ImplServices/MapaService';
import IEdificioRepo from '../../src/services/IRepos/IEdificioRepo';
import ISalaRepo from '../../src/services/IRepos/ISalaRepo';
import IPassagemRepo from '../../src/services/IRepos/IPassagemRepo';
import IMapaRepo from '../../src/services/IRepos/IMapaRepo';
import IPisoRepo from '../../src/services/IRepos/IPisoRepo';
import ICarregarMapaDTO from '../../src/dto/ICarregarMapaDTO';
import { Elevador } from '../../src/domain/elevador/Elevador';
import { MarcaElevador } from '../../src/domain/elevador/MarcaElevador';
import { ModeloElevador } from '../../src/domain/elevador/ModeloElevador';
import { NumeroSerieElevador } from '../../src/domain/elevador/NumeroSerieElevador';
import { DescricaoElevador } from '../../src/domain/elevador/DescricaoElevador';
import { IdElevador } from '../../src/domain/elevador/IdElevador';
import { IdMapa } from '../../src/domain/mapa/IdMapa';
import { TipoPonto } from '../../src/domain/mapa/TipoPonto';
import IExportarMapaDTO from '../../src/dto/IExportarMapaDTO';

describe('Mapa Service', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        Container.reset();
        let mapaSchemaInstance = require('../../src/persistence/schemas/MapaSchema').default;
        Container.set("mapaSchema", mapaSchemaInstance);
        let mapaRepoClass = require('../../src/repos/MapaRepo').default;
        let mapaRepoInstance = Container.get(mapaRepoClass);
        Container.set("mapaRepo", mapaRepoInstance);

        let pisoSchemaInstance = require('../../src/persistence/schemas/PisoSchema').default;
        Container.set("pisoSchema", pisoSchemaInstance);
        let pisoRepoClass = require('../../src/repos/PisoRepo').default;
        let pisoRepoInstance = Container.get(pisoRepoClass);
        Container.set("pisoRepo", pisoRepoInstance);

        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("edificioSchema", edificioSchemaInstance);
        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("edificioRepo", edificioRepoInstance);

        let salaSchemaInstance = require('../../src/persistence/schemas/SalaSchema').default;
        Container.set("salaSchema", salaSchemaInstance);
        let salaRepoClass = require('../../src/repos/SalaRepo').default;
        let salaRepoInstance = Container.get(salaRepoClass);
        Container.set("salaRepo", salaRepoInstance);

        let passagemSchemaInstance = require('../../src/persistence/schemas/PassagemSchema').default;
        Container.set("passagemSchema", passagemSchemaInstance);
        let passagemRepoClass = require('../../src/repos/PassagemRepo').default;
        let passagemRepoInstance = Container.get(passagemRepoClass);
        Container.set("passagemRepo", passagemRepoInstance);

        



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

        let mapaTipoPonto : TipoPonto[][] = [];
        for(let i = 0; i <= 5; i++){
            mapaTipoPonto[i] = [];
            for(let j = 0; j <= 5; j++){
                mapaTipoPonto[i][j] = TipoPonto.create(" ").getValue();
            }
        }
        let mapa;
        let mapaCompleto = Mapa.create({mapa: mapaTipoPonto}, IdMapa.create(1).getValue()).getValue();

        mapaCompleto.carregarMapaComBermas();
        mapaCompleto.criarPontosElevador(3,3,"Norte");
        mapaCompleto.carregarSalaMapa("sala1",0,0,2,2,1,0,"Norte");
        mapaCompleto.carregarPassagemMapa({id:1,abcissa:5,ordenada:3,orientacao:"Oeste"});
        mapaCompleto.rodarMapa();

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

        let elevadorNaoServePisoAtual = Elevador.create({
            pisosServidos: [Container.get('piso5x5'), Container.get('piso5x5_2')],
            marca: MarcaElevador.create("Marca").getValue(),
            modelo: ModeloElevador.create("Modelo").getValue(),
            numeroSerie : NumeroSerieElevador.create("NumeroSerie").getValue(),
            descricao : DescricaoElevador.create("Descricao").getValue(),
        }, IdElevador.create(1).getValue()).getValue();
        Container.set('elevadorNaoServePisoAtual', elevadorNaoServePisoAtual);
    });

    afterEach(function () {
        sinon.restore();
        sandbox.restore();
    });

    it('Carregar Mapa', async() =>{
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

        let passagemProps : any = {
            pisoA : edificio.returnListaPisos()[0],
            pisoB : Container.get('piso5x5_3'),
        }
        let passagem = Passagem.create(passagemProps, IdPassagem.create(1).getValue()).getValue();

        let mapaProps : any = {
            mapa : [],
        }
        let mapa = Mapa.create(mapaProps, IdMapa.create(1).getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(edificio));
        sinon.stub(mapaRepoInstance, 'getMaxId').returns(Promise.resolve(0));
        sinon.stub(salaRepoInstance, 'findSalasByPiso').returns(Promise.resolve([sala]));
        sinon.stub(passagemRepoInstance, 'listarPassagensComUmPiso').returns(Promise.resolve([passagem]));
        sinon.stub(mapaRepoInstance, 'save').returns(Promise.resolve(mapa));
        sinon.stub(pisoRepoInstance, 'save').returns(Promise.resolve(Container.get('piso5x5Vazio')));

        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.carregarMapa(body as ICarregarMapaDTO);


        expect(answer.getValue().codigoEdificio).to.equal(body.codigoEdificio);
        expect(answer.getValue().numeroPiso).to.equal(body.numeroPiso);
        expect(answer.getValue().passagens[0].id).to.equal(body.passagens[0].id);
        expect(answer.getValue().passagens[0].abcissa).to.equal(body.passagens[0].abcissa);
        expect(answer.getValue().passagens[0].ordenada).to.equal(body.passagens[0].ordenada);
        expect(answer.getValue().passagens[0].orientacao).to.equal(body.passagens[0].orientacao);
        expect(answer.getValue().elevador.xCoord).to.equal(body.elevador.xCoord);
        expect(answer.getValue().elevador.yCoord).to.equal(body.elevador.yCoord);
        expect(answer.getValue().elevador.orientacao).to.equal(body.elevador.orientacao);
        expect(answer.getValue().salas[0].nome).to.equal(body.salas[0].nome);
        expect(answer.getValue().salas[0].abcissaA).to.equal(body.salas[0].abcissaA);
        expect(answer.getValue().salas[0].ordenadaA).to.equal(body.salas[0].ordenadaA);
        expect(answer.getValue().salas[0].abcissaB).to.equal(body.salas[0].abcissaB);
        expect(answer.getValue().salas[0].ordenadaB).to.equal(body.salas[0].ordenadaB);
        expect(answer.getValue().salas[0].abcissaPorta).to.equal(body.salas[0].abcissaPorta);
        expect(answer.getValue().salas[0].ordenadaPorta).to.equal(body.salas[0].ordenadaPorta);
        expect(answer.getValue().salas[0].orientacaoPorta).to.equal(body.salas[0].orientacaoPorta);
    });

    it('CarregarMapa - Edificio não existe', async () => {
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

        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(null));

        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.carregarMapa(body as ICarregarMapaDTO);

        expect(answer.isFailure).to.equal(true);
        expect(answer.errorValue()).to.equal("O Edifício que inseriu não existe.");
    });

    it('CarregarMapa - Piso não existe', async () => {
        let body = {
            "codigoEdificio": "ED01",
            "numeroPiso" : 7,
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

        let edificioProps : any = {
            nome: Nome.create('ED01 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [Container.get('piso5x5Vazio'), Container.get('piso5x5_2')],
        };    
        
        
        let edificio = Edificio.create(edificioProps, Codigo.create(body.codigoEdificio).getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(edificio));

        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.carregarMapa(body as ICarregarMapaDTO);

        expect(answer.isFailure).to.equal(true);
        expect(answer.errorValue()).to.equal("O piso que inseriu não existe.");

    });

    it('CarregarMapa - Passagem não existe', async () => {
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

        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(edificio));
        sinon.stub(mapaRepoInstance, 'getMaxId').returns(Promise.resolve(0));
        sinon.stub(salaRepoInstance, 'findSalasByPiso').returns(Promise.resolve([sala]));
        sinon.stub(passagemRepoInstance, 'listarPassagensComUmPiso').returns(Promise.resolve([]));        

        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.carregarMapa(body as ICarregarMapaDTO);

        expect(answer.isFailure).to.equal(true);
        expect(answer.errorValue()).to.equal("Não existem passagens que satisfaçam os dados inseridos");
        
    });

    it('CarregarMapa - Elevador não existe', async () => {
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

        let edificioProps : any = {
            nome: Nome.create('ED01 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [Container.get('piso5x5Vazio'), Container.get('piso5x5_2')],
        };    
        
        
        let edificio = Edificio.create(edificioProps, Codigo.create(body.codigoEdificio).getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        let salaProps : any = {
            piso : edificio.returnListaPisos()[0],
            categoria : Categorizacao.create("Gabinete").getValue(),
            descricao : DescricaoSala.create("B203").getValue(),
            listaPontos : [undefined, undefined],
        }
        let sala = Sala.create(salaProps, NomeSala.create(body.salas[0].nome).getValue()).getValue();

        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(edificio));
        sinon.stub(mapaRepoInstance, 'getMaxId').returns(Promise.resolve(0));
        sinon.stub(salaRepoInstance, 'findSalasByPiso').returns(Promise.resolve([sala]));
        
        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.carregarMapa(body as ICarregarMapaDTO);

        expect(answer.isFailure).to.equal(true);
        expect(answer.errorValue()).to.equal("Não existe elevador neste edifício.");

    });

    it('CarregarMapa - Sala não existe', async () => {
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

        let edificioProps : any = {
            nome: Nome.create('ED01 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [Container.get('piso5x5Vazio'), Container.get('piso5x5_2')],
        };    
        
        
        let edificio = Edificio.create(edificioProps, Codigo.create(body.codigoEdificio).getValue()).getValue();
        edificio.adicionarElevador(Container.get('elevador'));


        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(edificio));
        sinon.stub(mapaRepoInstance, 'getMaxId').returns(Promise.resolve(0));
        sinon.stub(salaRepoInstance, 'findSalasByPiso').returns(Promise.resolve([]));

        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.carregarMapa(body as ICarregarMapaDTO);

        expect(answer.isFailure).to.equal(true);
        expect(answer.errorValue()).to.equal("Não existem salas que satisfaçam os dados inseridos");
    });

    it('CarregarMapa - Elevador não serve o piso atual', async () => {
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

        let edificioProps : any = {
            nome: Nome.create('ED01 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [Container.get('piso5x5Vazio'), Container.get('piso5x5_2'), Container.get('piso5x5_3')],
        };    
        
        
        let edificio = Edificio.create(edificioProps, Codigo.create(body.codigoEdificio).getValue()).getValue();
        edificio.adicionarElevador(Container.get('elevadorNaoServePisoAtual'));

        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;
        let salaProps : any = {
            piso : edificio.returnListaPisos()[0],
            categoria : Categorizacao.create("Gabinete").getValue(),
            descricao : DescricaoSala.create("B203").getValue(),
        }
        let sala = Sala.create(salaProps, NomeSala.create(body.salas[0].nome).getValue()).getValue();

        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(edificio));
        sinon.stub(mapaRepoInstance, 'getMaxId').returns(Promise.resolve(0));
        sinon.stub(salaRepoInstance, 'findSalasByPiso').returns(Promise.resolve([sala]));


        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.carregarMapa(body as ICarregarMapaDTO);

        expect(answer.isFailure).to.equal(true);
        expect(answer.errorValue()).to.equal("O elevador não serve este piso.");
    });

    it('Exportar Mapa', async () => {

        let body = {
            "codigoEdificio": "ED01",
            "numeroPiso" : 0,
        }

        let edificioProps : any = {
            nome: Nome.create('ED01 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [Container.get('piso5x5')],
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        
        let edificio = Edificio.create(edificioProps, Codigo.create(body.codigoEdificio).getValue()).getValue();
        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(edificio));

        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.exportarMapa(body as IExportarMapaDTO);


        expect(answer.getValue().codigoEdificio).to.equal(body.codigoEdificio);
        expect(answer.getValue().numeroPiso).to.equal(body.numeroPiso);
        expect(answer.getValue().texturaChao).to.equal("assets/ground.jpg");
        expect(answer.getValue().texturaParede).to.equal("assets/wall.jpg");
        expect(answer.getValue().modeloPorta).to.equal("assets/door.glb");
        expect(answer.getValue().modeloElevador).to.equal("assets/elevator.glb");
        expect(answer.getValue().salas).to.deep.equal([{nome:"sala1",abcissaA: 0, abcissaB: 2,ordenadaA: 0,ordenadaB: 2,abcissaPorta: 0, ordenadaPorta: 1, orientacaoPorta: "Norte"}]);
        expect(answer.getValue().elevador).to.deep.equal({xCoord: 3, yCoord: 3, orientacao: "Norte"});
        console.log(answer.getValue().passagens);
        expect(answer.getValue().passagens).to.deep.equal([{id: 1, abcissaA: 3, ordenadaA: 5, abcissaB:4, ordenadaB:5, orientacao: "Oeste"}]);

    });

    it('Exportar Mapa com edificio inexistente', async () => {

        let body = {
            "codigoEdificio": "ED01",
            "numeroPiso" : 0,
        }

        let edificioProps : any = {
            nome: Nome.create('ED01 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [Container.get('piso5x5')],
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        
        let edificio = Edificio.create(edificioProps, Codigo.create(body.codigoEdificio).getValue()).getValue();
        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(null));
        sinon.stub()

        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.exportarMapa(body as IExportarMapaDTO);


        expect(answer.errorValue()).to.equal("O Edifício que inseriu não existe.");
    });

    it('Exportar Mapa com mapa vazio', async () => {

        let body = {
            "codigoEdificio": "ED01",
            "numeroPiso" : 0,
        }

        let edificioProps : any = {
            nome: Nome.create('ED01 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [Container.get('piso5x5Vazio')],
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        
        let edificio = Edificio.create(edificioProps, Codigo.create(body.codigoEdificio).getValue()).getValue();
        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(edificio));
        sinon.stub()

        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.exportarMapa(body as IExportarMapaDTO);

        expect(answer.errorValue()).to.equal("O mapa não tem nada para exportar.");
    });

    it('exportarMapaAtravesDeUmaPassagemEPiso', async () => {

        let idPassagem = 1;
        let codEd = "ED02";
        let numeroPiso = 1;

        let edificioProps : any = {
            nome: Nome.create('ED01 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [Container.get('piso5x5')],
        };
        let edificioComMapa = Edificio.create(edificioProps, Codigo.create("ED01").getValue()).getValue();
        let edificioProps2 : any = {
            nome: Nome.create('ED02 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [],
        };
        let ediInicial = Edificio.create(edificioProps2, Codigo.create("ED02").getValue()).getValue();
        let mapa;
        // Criar 2 pisos
        let piso2 = Piso.create({
            numeroPiso:  NumeroPiso.create(1).getValue(),
            descricaoPiso: DescricaoPiso.create("Ola").getValue(),
            mapa: mapa,
        }, IdPiso.create(7).getValue()).getValue();

        ediInicial.addPiso(piso2);
        let passagem = Passagem.create({
            pisoA: piso2,
            pisoB: Container.get('piso5x5'),
        }, IdPassagem.create(1).getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        sinon.stub(passagemRepoInstance, 'findByDomainId').returns(Promise.resolve(passagem));
        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(ediInicial));
        sinon.stub(edificioRepoInstance, 'findByPiso').returns(Promise.resolve(edificioComMapa));

        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.exportarMapaAtravesDeUmaPassagemEPiso(idPassagem,codEd,numeroPiso);

        expect(answer.getValue().codigoEdificio).to.equal("ED01");
        expect(answer.getValue().numeroPiso).to.equal(0);
        expect(answer.getValue().texturaChao).to.equal("assets/ground.jpg");
        expect(answer.getValue().texturaParede).to.equal("assets/wall.jpg");
        expect(answer.getValue().modeloPorta).to.equal("assets/door.glb");
        expect(answer.getValue().modeloElevador).to.equal("assets/elevator.glb");
        expect(answer.getValue().salas).to.deep.equal([{nome:"sala1",abcissaA: 0, abcissaB: 2,ordenadaA: 0,ordenadaB: 2,abcissaPorta: 0, ordenadaPorta: 1, orientacaoPorta: "Norte"}]);
        expect(answer.getValue().elevador).to.deep.equal({xCoord: 3, yCoord: 3, orientacao: "Norte"});
        console.log(answer.getValue().passagens);
        expect(answer.getValue().passagens).to.deep.equal([{id: 1, abcissaA: 3, ordenadaA: 5, abcissaB:4, ordenadaB:5, orientacao: "Oeste"}]);
    });


    it('exportarMapaAtravesDeUmaPassagemEPiso passagem não existe', async () => {

        let idPassagem = 1;
        let codEd = "ED02";
        let numeroPiso = 1;

        let edificioProps : any = {
            nome: Nome.create('ED01 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [Container.get('piso5x5')],
        };
        let edificioComMapa = Edificio.create(edificioProps, Codigo.create("ED01").getValue()).getValue();
        let edificioProps2 : any = {
            nome: Nome.create('ED02 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [],
        };
        let ediInicial = Edificio.create(edificioProps2, Codigo.create("ED02").getValue()).getValue();
        let mapa;
        // Criar 2 pisos
        let piso2 = Piso.create({
            numeroPiso:  NumeroPiso.create(1).getValue(),
            descricaoPiso: DescricaoPiso.create("Ola").getValue(),
            mapa: mapa,
        }, IdPiso.create(7).getValue()).getValue();

        ediInicial.addPiso(piso2);
        let passagem = Passagem.create({
            pisoA: piso2,
            pisoB: Container.get('piso5x5'),
        }, IdPassagem.create(1).getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        sinon.stub(passagemRepoInstance, 'findByDomainId').returns(null);
        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(Promise.resolve(ediInicial));
        sinon.stub(edificioRepoInstance, 'findByPiso').returns(Promise.resolve(edificioComMapa));

        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.exportarMapaAtravesDeUmaPassagemEPiso(idPassagem,codEd,numeroPiso);

        expect(answer.errorValue()).to.equal("A passagem não existe.");

    });

    it('exportarMapaAtravesDeUmaPassagemEPiso edificio não existe', async () => {

        let idPassagem = 1;
        let codEd = "ED02";
        let numeroPiso = 1;

        let edificioProps : any = {
            nome: Nome.create('ED01 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [Container.get('piso5x5')],
        };
        let edificioComMapa = Edificio.create(edificioProps, Codigo.create("ED01").getValue()).getValue();
        let edificioProps2 : any = {
            nome: Nome.create('ED02 A').getValue(),
            dimensao: Dimensao.create(4,4).getValue(),
            listaPisos: [],
        };
        let ediInicial = Edificio.create(edificioProps2, Codigo.create("ED02").getValue()).getValue();
        let mapa;
        // Criar 2 pisos
        let piso2 = Piso.create({
            numeroPiso:  NumeroPiso.create(1).getValue(),
            descricaoPiso: DescricaoPiso.create("Ola").getValue(),
            mapa: mapa,
        }, IdPiso.create(7).getValue()).getValue();

        ediInicial.addPiso(piso2);
        let passagem = Passagem.create({
            pisoA: piso2,
            pisoB: Container.get('piso5x5'),
        }, IdPassagem.create(1).getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo") as IEdificioRepo;
        let salaRepoInstance = Container.get("SalaRepo") as ISalaRepo;
        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;
        let mapaRepoInstance = Container.get("MapaRepo") as IMapaRepo;
        let pisoRepoInstance = Container.get("PisoRepo") as IPisoRepo;

        sinon.stub(passagemRepoInstance, 'findByDomainId').returns(Promise.resolve(passagem));
        sinon.stub(edificioRepoInstance, 'findByDomainId').returns(null);

        const mapaService = new MapaService(mapaRepoInstance, edificioRepoInstance, salaRepoInstance, passagemRepoInstance, pisoRepoInstance);
        let answer = await mapaService.exportarMapaAtravesDeUmaPassagemEPiso(idPassagem,codEd,numeroPiso);

        expect(answer.errorValue()).to.equal("O edifício não existe.");

    });
});