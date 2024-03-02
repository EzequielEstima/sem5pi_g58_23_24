import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { IPisoPersistence } from "../../src/dataschema/IPisoPersistence";
import { Piso } from "../../src/domain/piso/Piso";
import  ICriarPisoDTO  from '../../src/dto/ICriarPisoDTO';
import  {PisoMap}  from "../../src/mappers/PisoMap";
import IPisoRepo from "../../src/services/IRepos/IPisoRepo";
import PisoService from '../../src/services/ImplServices/PisoService';
import IEdificioRepo from "../../src/services/IRepos/IEdificioRepo";
import { Edificio } from "../../src/domain/edificio/Edificio";
import { Codigo } from '../../src/domain/edificio/Codigo';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Nome } from '../../src/domain/edificio/Nome';
import {DescricaoPiso} from '../../src/domain/piso/DescricaoPiso'
import {NumeroPiso} from '../../src/domain/piso/NumeroPiso'
import {IdPiso} from '../../src/domain/piso/IdPiso'
import { IEdificioPersistence } from "../../src/dataschema/IEdificioPersistence";
import PisoRepo from "../../src/repos/PisoRepo";
import EdificioRepo from "../../src/repos/EdificioRepo";
import IEditarPisoDTO from "../../src/dto/IEditarPisoDTO";
import IElevadorRepo from "../../src/services/IRepos/IElevadorRepo";
import IElevadorService from "../../src/services/IServices/IElevadorService";


describe('PisoService ', () => {

    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        Container.reset();
    
        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(1,1).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [],
        };
        let mapa;
		let piso = Piso.create({
            numeroPiso:  NumeroPiso.create(0).getValue(),
            descricaoPiso: DescricaoPiso.create("Ola").getValue(),
            mapa: mapa,
        }, IdPiso.create(1).getValue()).getValue();

        
        let edificio = Edificio.create(edificioProps,Codigo.create('ED01').getValue()).getValue();
        edificio.addPiso(piso);

        Container.set("edificio", edificio)

        let pisoSchemaInstance = require('../../src/persistence/schemas/PisoSchema').default;
        Container.set("PisoSchema", pisoSchemaInstance);

        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let elevadorSchemaInstance = require('../../src/persistence/schemas/ElevadorSchema').default;
        Container.set("ElevadorSchema", elevadorSchemaInstance);
        
        let pisoRepoClass = require('../../src/repos/PisoRepo').default;
        let pisoRepoInstance = Container.get(pisoRepoClass);
        Container.set("PisoRepo", pisoRepoInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('CriarPiso falha porque não existe edificio', async () => {
        


        let body = {
            "codigo": "as1",
            "numeroPiso": 0,
            "descricaoPiso": "ola",
        };


        let pisoRepoInstance = Container.get("PisoRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        const answer = await pisoService.criarPiso(body as ICriarPisoDTO);
        expect(answer.errorValue()).to.equal("O edificio com o código as1 não existe");

    });


    it('CriarPiso falha porque já existe o piso', async () => {
        
        let body = {
            "codigo": "as1",
            "numeroPiso": 0,
            "descricaoPiso": "ola",
        };

        let pisoRepoInstance = Container.get("PisoRepo");
        let edificioRepoInstance = Container.get("EdificioRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = await pisoService.criarPiso(body as ICriarPisoDTO);
        expect(answer.errorValue()).to.equal("O piso numero 0 já existe");

    });


    it('Criar o piso com descrição nula', async () => {
        
        let body = {
            "codigo": "as1",
            "numeroPiso": 1,
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");
        sinon.stub(pisoRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(edificioRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(pisoRepoInstance, "getMaxId").returns(Promise.resolve(1));
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = await pisoService.criarPiso(body as ICriarPisoDTO);
        expect(answer.getValue()).to.equal(body as ICriarPisoDTO);

    });

    it('Criar o piso com descrição preenchida', async () => {
        
        let body = {
            "codigo": "as1",
            "numeroPiso": 1,
            "descricaoPiso": "ola",
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");


        sinon.stub(pisoRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(edificioRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(pisoRepoInstance, "getMaxId").returns(Promise.resolve(1));
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = await pisoService.criarPiso(body as ICriarPisoDTO);
        expect(answer.getValue()).to.equal(body as ICriarPisoDTO);

    });

    it('Criar o piso com descrição vazia', async () => {
        
        let body = {
            "codigo": "as1",
            "numeroPiso": 1,
            "descricaoPiso": "",
        };
        
        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");

        
        sinon.stub(pisoRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(edificioRepoInstance, "save").returns(Promise.resolve(null));
        sinon.stub(pisoRepoInstance, "getMaxId").returns(Promise.resolve(1));
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = await pisoService.criarPiso(body as ICriarPisoDTO);
        expect(answer.getValue()).to.equal(body as ICriarPisoDTO);

    });

    it('listarTodosOsPisosDeUmEdificio sem existir o falha', async () => {
        
        let codigo = "as1";

        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");



        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = await pisoService.listarTodosOsPisosDeUmEdificio(codigo);
        expect(answer.errorValue()).to.equal("O edificio com o código " + codigo +" não existe");

    });

    it('listarTodosOsPisosDeUmEdificio de um edificio sem pisos falha', async () => {
        
        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(1,1).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [],
        };
        let edificio = Edificio.create(edificioProps,Codigo.create('as1').getValue()).getValue();

        let codigo = "as1";

        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");

        
        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(edificio));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = await pisoService.listarTodosOsPisosDeUmEdificio(codigo);
        expect(answer.errorValue()).to.equal("Não existem pisos nesse Edificio");

    });

    it('listarTodosOsPisosDeUmEdificio tem sucesso', async () => {

        let codigo = "ED01";

        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");


        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = (await pisoService.listarTodosOsPisosDeUmEdificio(codigo)).getValue();
        expect(answer[0].descricaoPiso).to.equal("Ola");
        expect(answer[0].numeroPiso).to.equal(0);
        expect(answer[0].id).to.equal(1);

    });

    it('PisoService + EdificioRepo listarTodosOsPisosDeUmEdificio', async () => {

        let codigo = "ED01";
        
        const pisoPersistence = {
            domainID: 1,
            numeroPiso: 1,
            descricaoPiso: "Ola",
        } as IPisoPersistence;

        const edificioPersistence = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : [1],
        } as IEdificioPersistence ;

        const edificioSchemaInstance = Container.get("EdificioSchema");
        const pisoSchemaInstance = Container.get("PisoSchema");
        sinon.stub(edificioSchemaInstance, "findOne").returns(edificioPersistence);
        sinon.stub(pisoSchemaInstance, "findOne").returns(pisoPersistence);



        const pisoService = new PisoService(new PisoRepo(pisoSchemaInstance as any),new EdificioRepo(edificioSchemaInstance as any));
        let answer = (await pisoService.listarTodosOsPisosDeUmEdificio(codigo)).getValue();
        expect(answer[0].descricaoPiso).to.equal("Ola");
        expect(answer[0].numeroPiso).to.equal(1);
        expect(answer[0].id).to.equal(1);

    });

    it('editarPiso falha porque o edificio não existe', async () => {

        let body = {
            codigoEdificio: "ED01",
	        numeroPiso: 0,
            novoNumeroPiso: 1,
	        descricaoPiso: "ola"
        }

        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");


        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = (await pisoService.editarPiso(body as IEditarPisoDTO));
        expect(answer.isFailure).to.equal(true);
        expect(answer.errorValue()).to.equal("O edificio com o código " + body.codigoEdificio +" não existe");

    });

    it('editarPiso falha porque o piso não existe', async () => {

        let body = {
            codigoEdificio: "ED01",
	        numeroPiso: 1,
            novoNumeroPiso: 2,
	        descricaoPiso: "ola"
        }

        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");


        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = (await pisoService.editarPiso(body as IEditarPisoDTO));
        expect(answer.isFailure).to.equal(true);
        expect(answer.errorValue()).to.equal("O piso com o numero " + body.numeroPiso +" não existe");
    });

    it('editarPiso falha porque o novo numero de piso já existe', async () => {

        let body = {
            codigoEdificio: "ED01",
	        numeroPiso: 0,
            novoNumeroPiso: 0,
	        descricaoPiso: "ola"
        }

        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");


        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = (await pisoService.editarPiso(body as IEditarPisoDTO));
        expect(answer.isFailure).to.equal(true);
        expect(answer.errorValue()).to.equal("Já existe o piso numero " + body.novoNumeroPiso);
    });

    it('editarPiso com novo numero de piso e nova descricao tem sucesso', async () => {

        let body = {
            codigoEdificio: "ED01",
	        numeroPiso: 0,
            novoNumeroPiso: 1,
	        descricaoPiso: "ola"
        }
        
        let mapa;
		let piso = Piso.create({
            numeroPiso:  NumeroPiso.create(body.novoNumeroPiso).getValue(),
            descricaoPiso: DescricaoPiso.create(body.descricaoPiso).getValue(),
            mapa: mapa,
        }, IdPiso.create(1).getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");


        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        sinon.stub(pisoRepoInstance, "save").returns(Promise.resolve(piso));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = (await pisoService.editarPiso(body as IEditarPisoDTO));
        expect(answer.isSuccess).to.equal(true);
        expect(answer.getValue().descricaoPiso).to.equal(body.descricaoPiso);
        expect(answer.getValue().numeroPiso).to.equal(body.novoNumeroPiso);
    });


    it('editarPiso apenas com novo numero de piso tem sucesso', async () => {

        let body = {
            codigoEdificio: "ED01",
	        numeroPiso: 0,
            novoNumeroPiso: 1,
        }
        let mapa;
		let piso = Piso.create({
            numeroPiso:  NumeroPiso.create(body.novoNumeroPiso).getValue(),
            descricaoPiso: DescricaoPiso.create("Ola").getValue(),
            mapa: mapa,
        }, IdPiso.create(1).getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");


        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        sinon.stub(pisoRepoInstance, "save").returns(Promise.resolve(piso));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = (await pisoService.editarPiso(body as IEditarPisoDTO));
        expect(answer.isSuccess).to.equal(true);
        expect(answer.getValue().descricaoPiso).to.equal("Ola");
        expect(answer.getValue().numeroPiso).to.equal(body.novoNumeroPiso);
    });

    it('editarPiso apenas com nova descricao tem sucesso', async () => {

        let body = {
            codigoEdificio: "ED01",
	        numeroPiso: 0,
            descricaoPiso: "ola"

        }
        let mapa;

		let piso = Piso.create({
            numeroPiso:  NumeroPiso.create(0).getValue(),
            descricaoPiso: DescricaoPiso.create(body.descricaoPiso).getValue(),
            mapa: mapa,
        }, IdPiso.create(1).getValue()).getValue();

        let edificioRepoInstance = Container.get("EdificioRepo");
        let pisoRepoInstance = Container.get("PisoRepo");

        sinon.stub(edificioRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("edificio")));
        sinon.stub(pisoRepoInstance, "save").returns(Promise.resolve(piso));
        const pisoService = new PisoService(pisoRepoInstance as IPisoRepo,edificioRepoInstance as IEdificioRepo);
        let answer = (await pisoService.editarPiso(body as IEditarPisoDTO));
        expect(answer.isSuccess).to.equal(true);
        expect(answer.getValue().descricaoPiso).to.equal(body.descricaoPiso);
        expect(answer.getValue().numeroPiso).to.equal(0);
    });

    it('PisoService + PisoRepo editarPiso com novo numero de piso e nova descricao tem sucesso', async () => {
        let body = {
            codigoEdificio: "ED01",
	        numeroPiso: 0,
            novoNumeroPiso: 1,
	        descricaoPiso: "ola"
        }

        const pisoPersistence = {
            domainID: 1,
            numeroPiso: 0,
            descricaoPiso: "Ola",
            save() { return this; }
        } as unknown as IPisoPersistence & Document<any, any, any>;

        const edificioPersistence = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : [1],
        } as IEdificioPersistence ;

        
        const edificioSchemaInstance = Container.get("EdificioSchema");
        const pisoSchemaInstance = Container.get("PisoSchema");

        sinon.stub(edificioSchemaInstance, "findOne").returns(edificioPersistence);
        sinon.stub(pisoSchemaInstance, "findOne").returns(pisoPersistence);


        const pisoService = new PisoService(new PisoRepo(pisoSchemaInstance as any),new EdificioRepo(edificioSchemaInstance as any));
        let answer = (await pisoService.editarPiso(body as IEditarPisoDTO));
        expect(answer.isSuccess).to.equal(true);
        expect(answer.getValue().descricaoPiso).to.equal(body.descricaoPiso);
        expect(answer.getValue().numeroPiso).to.equal(body.novoNumeroPiso);
    });

});
