import { expect } from "chai";
import 'mocha';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import PassagemService from '../../src/services/ImplServices/PassagemService';

import { Edificio } from "../../src/domain/edificio/Edificio";
import { Codigo } from '../../src/domain/edificio/Codigo';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Nome } from '../../src/domain/edificio/Nome';
import { Ponto } from "../../src/domain/ponto/Ponto";
import { Coordenadas } from "../../src/domain/ponto/Coordenadas";
import { TipoPonto } from "../../src/domain/ponto/TipoPonto";
import { Piso } from "../../src/domain/piso/Piso";
import { DescricaoPiso } from "../../src/domain/piso/DescricaoPiso";
import { NumeroPiso } from "../../src/domain/piso/NumeroPiso";
import IPassagemRepo from "../../src/services/IRepos/IPassagemRepo";
import IEdificioRepo from "../../src/services/IRepos/IEdificioRepo";
import { Result } from "../../src/core/logic/Result";
import { Elevador } from "../../src/domain/elevador/Elevador";
import IPassagemDTO from "../../src/dto/IPassagemDTO";
import { Passagem } from "../../src/domain/passagem/Passagem";
import IListarPassagensPorParDeEdificioDTO from "../../src/dto/IListarPassagensPorParDeEdificioDTO";
import { IdPiso } from "../../src/domain/piso/IdPiso";
import { IdPonto } from "../../src/domain/ponto/IdPonto";
import { IPassagemPersistence } from "../../src/dataschema/IPassagemPersistence";
import IPisoRepo from "../../src/services/IRepos/IPisoRepo";
import { Mapa } from "../../src/domain/mapa/Mapa";
import { IdPassagem } from "../../src/domain/passagem/IdPassagem";

describe('PassagemService ', () => {


    const sandbox = sinon.createSandbox();
    beforeEach(() => {

        Container.reset();

        //Criar edificios
        let edificioProps : any = {
            nome: Nome.create('Edificio A').getValue(),
            dimensao:Dimensao.create(2,2).getValue(),
            descricao:DescricaoEdificio.create('Edificio A').getValue(),
            listaPisos: [],
        };
        
        const edificio1 = Edificio.create(edificioProps,Codigo.create('COD').getValue()).getValue();
        
        let edificioProps2 : any = {
            nome: Nome.create('Edificio B').getValue(),
            dimensao:Dimensao.create(2,2).getValue(),
            descricao:DescricaoEdificio.create('Edificio B').getValue(),
            listaPisos: [],
        };
        
        const edificio2 = Edificio.create(edificioProps2,Codigo.create('COD1').getValue()).getValue();
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

        edificio1.addPiso(piso1);
        edificio2.addPiso(piso2);

        let passagem = Passagem.create({
            pisoA: piso1,
            pisoB: piso2,
        }, IdPassagem.create(1).getValue()).getValue();

        
        Container.set("Edificio1", edificio1);
        Container.set("Edificio2", edificio2);

        Container.set("Piso1", piso1);
        Container.set("Piso2", piso2);

        Container.set("Passagem", passagem);

        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let passagemSchemaInstance = require('../../src/persistence/schemas/PassagemSchema').default;
        Container.set("PassagemSchema", passagemSchemaInstance);

        let pisoSchemaInstance = require('../../src/persistence/schemas/PisoSchema').default;
        Container.set("PisoSchema", pisoSchemaInstance);

        let passagemRepoClass = require('../../src/repos/PassagemRepo').default;
        let passagemRepoInstance = Container.get(passagemRepoClass);
        Container.set("PassagemRepo", passagemRepoInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

        let pisoRepoClass = require('../../src/repos/PisoRepo').default;
        let pisoRepoInstance = Container.get(pisoRepoClass);
        Container.set("PisoRepo", pisoRepoInstance);

    });

    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('Passagem criada com sucesso', async () => {

        let body = {
            id: 2,
            codigoEdificioA: "1",
            codigoEdificioB: "2",
            numeroPisoA: 1,
            numeroPisoB: 1,
        }

        let data = await createAllData(body.codigoEdificioA, body.numeroPisoA, body.codigoEdificioB, body.numeroPisoB);

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

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.criarPassagem(body as IPassagemDTO);
        expect(answer.isSuccess).to.equal(true);
    });

    it('Passagem já existe', async () => {

        let body = {
            id: 2,
            codigoEdificioA: "1",
            codigoEdificioB: "2",
            numeroPisoA: 1,
            numeroPisoB: 1,
        }

        let data = await createAllData(body.codigoEdificioA, body.numeroPisoA, body.codigoEdificioB, body.numeroPisoB);

        const edificioA = data.getValue().edificioA
        const edificioB = data.getValue().edificioB

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificioA));
        stubRepo.onCall(1).returns(Promise.resolve(edificioB));
        let passagemRepo = Container.get("PassagemRepo") as IPassagemRepo;
        let stubPassagemRepo = sinon.stub(passagemRepo, 'findByDomainId');
        stubPassagemRepo.onCall(0).returns(null);
        stubPassagemRepo.onCall(1).returns(edificioA);
        let stubRepo2 = sinon.stub(passagemRepo, 'save');
        stubRepo2.onCall(0).returns(Promise.resolve(Passagem));
        let stubRepo22 = sinon.stub(passagemRepo, 'getMaxId');
        stubRepo22.onCall(0).returns(Promise.resolve(1));
        let stubRepoo = sinon.stub(edificioRepo, 'save');
        stubRepoo.onCall(0).returns(Promise.resolve(edificioA));
        stubRepoo.onCall(1).returns(Promise.resolve(edificioB));

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.criarPassagem(body as IPassagemDTO);

        answer = await passagemService.criarPassagem(body as IPassagemDTO);
        expect(answer.errorValue()).to.equal("A passagem com o id " + body.id + " já existe")
    });

    it('Passagem não pode ser criada porque edificio não existe', async () => {

        let body = {
            id: 2,
            codigoEdificioA: "1",
            codigoEdificioB: "2",
            numeroPisoA: 1,
            numeroPisoB: 1,
        }

        let data = await createAllData(body.codigoEdificioA, body.numeroPisoA, body.codigoEdificioB, body.numeroPisoB);

        const edificioA = data.getValue().edificioA
        const edificioB = data.getValue().edificioB

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificioA));
        stubRepo.onCall(1).returns(Promise.resolve(null));
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

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.criarPassagem(body as IPassagemDTO);

        answer = await passagemService.criarPassagem(body as IPassagemDTO);
        expect(answer.errorValue()).to.equal("Edificio A não existe")
    });

    it('Passagem não pode ser criada porque piso não existe', async () => {

        let body = {
            id: 2,
            codigoEdificioA: "1",
            codigoEdificioB: "2",
            numeroPisoA: 2,
            numeroPisoB: 2,
        }

        let data = await createAllData(body.codigoEdificioA, 1, body.codigoEdificioB, 1,);

        let edificioA = data.getValue().edificioA
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

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.criarPassagem(body as IPassagemDTO);

        answer = await passagemService.criarPassagem(body as IPassagemDTO);
        expect(answer.errorValue()).to.equal("Piso A não existe")

    });

    
    it('(Listar passagem por par de edifícios) Edifício A não existe', async () => {

        let body = {
            edificioACod: "NaoExiste",
            edificioBCod: "COD1",
        } as IListarPassagensPorParDeEdificioDTO

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let passagemRepo = Container.get("PassagemRepo") as IPassagemRepo;

        let stubFindByIdEdRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubFindByIdEdRepo.onCall(0).returns(Promise.resolve(null));

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.listarPassagensPorParDeEdificios(body as IListarPassagensPorParDeEdificioDTO);

        expect(answer.errorValue()).to.equal("Edificio A não existe")
    });

    it('(Listar passagem por par de edifícios) Edifício B não existe', async () => {

        let body = {
            edificioACod: "COD",
            edificioBCod: "NaoExiste",
        } as IListarPassagensPorParDeEdificioDTO

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let passagemRepo = Container.get("PassagemRepo") as IPassagemRepo;

        let stubFindByIdEdRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubFindByIdEdRepo.onCall(0).returns(Promise.resolve(Container.get("Edificio1")));
        stubFindByIdEdRepo.onCall(1).returns(Promise.resolve(null));

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.listarPassagensPorParDeEdificios(body as IListarPassagensPorParDeEdificioDTO);

        expect(answer.errorValue()).to.equal("Edificio B não existe")
    });

    it('(Listar passagem por par de edifícios) Apenas é passado o edificio A', async () => {

        let body = {
            edificioACod: "COD",
        } as IListarPassagensPorParDeEdificioDTO

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let passagemRepo = Container.get("PassagemRepo") as IPassagemRepo;

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.listarPassagensPorParDeEdificios(body as IListarPassagensPorParDeEdificioDTO);

        expect(answer.errorValue()).to.equal("Não é possível listar passagens apenas para um edificio")
    });

    it('(Listar passagem por par de edifícios) Apenas é passado o edificio B', async () => {

        let body = {
            edificioBCod: "COD",
        } as IListarPassagensPorParDeEdificioDTO

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let passagemRepo = Container.get("PassagemRepo") as IPassagemRepo;

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.listarPassagensPorParDeEdificios(body as IListarPassagensPorParDeEdificioDTO);

        expect(answer.errorValue()).to.equal("Não é possível listar passagens apenas para um edificio")
    });

    it('(Listar passagem por par de edifícios) Náo exitem passagens que satisfaçam as condições', async () => {

        let body = {
        } as IListarPassagensPorParDeEdificioDTO

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let passagemRepo = Container.get("PassagemRepo") as IPassagemRepo;

        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;

        sinon.stub(passagemRepoInstance, "findAll").returns(Promise.resolve([]));

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = await passagemService.listarPassagensPorParDeEdificios(body as IListarPassagensPorParDeEdificioDTO);

        expect(answer.errorValue()).to.equal("Não existem passagens que satisfaçam os parâmetros de pesquisa")
    });

    it('(Listar passagem por par de edifícios) Sucesso quando não são passados parâmetros', async () => {

        let body = {
        } as IListarPassagensPorParDeEdificioDTO

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let passagemRepo = Container.get("PassagemRepo") as IPassagemRepo;

        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;

        sinon.stub(passagemRepoInstance, "findAll").returns(Promise.resolve([Container.get("Passagem")]));

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = (await passagemService.listarPassagensPorParDeEdificios(body as IListarPassagensPorParDeEdificioDTO)).getValue();

        expect(answer[0].id.valueOf()).to.equal(1)
    });

    it('(Listar passagem por par de edifícios) Sucesso quando são passados 2 códigos de edifícios', async () => {

        let body = {
            edificioACod: "COD",
            edificioBCod: "COD1",
        } as IListarPassagensPorParDeEdificioDTO

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let passagemRepo = Container.get("PassagemRepo") as IPassagemRepo;

        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;

        let stubFindByIdEdRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubFindByIdEdRepo.onCall(0).returns(Promise.resolve(Container.get("Edificio1")));
        stubFindByIdEdRepo.onCall(1).returns(Promise.resolve(Container.get("Edificio2")));

        sinon.stub(passagemRepoInstance, "listarPassagensPorParDePisos").returns(Promise.resolve([Container.get("Passagem")]));

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = (await passagemService.listarPassagensPorParDeEdificios(body as IListarPassagensPorParDeEdificioDTO)).getValue();

        expect(answer[0].id.valueOf()).to.equal(1)
    });

    it('(Listar passagem por par de edifícios) Teste de integração PassagemService + PassagemRepo', async () => {

        let body = {
        } as IListarPassagensPorParDeEdificioDTO

        
        
        const passagemPersistence = {
            domainID: 1,
            pisoA: 1,
            pisoB: 2,
        } as IPassagemPersistence;

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let passagemRepo = Container.get("PassagemRepo") as IPassagemRepo;
        let pisoRepo = Container.get("PisoRepo") as IPisoRepo;

        let passagemSchemaInstance = Container.get("PassagemSchema");

        let passagemRepoInstance = Container.get("PassagemRepo") as IPassagemRepo;

        sinon.stub(passagemSchemaInstance, "find").returns(Promise.resolve([passagemPersistence]));

        let stubFindByIdPisoRepo = sinon.stub(pisoRepo, 'findByDomainId');
        stubFindByIdPisoRepo.onCall(0).returns(Promise.resolve(Container.get("Piso1")));
        stubFindByIdPisoRepo.onCall(1).returns(Promise.resolve(Container.get("Piso2")));

        const passagemService = new PassagemService(passagemRepo, edificioRepo);

        let answer = (await passagemService.listarPassagensPorParDeEdificios(body as IListarPassagensPorParDeEdificioDTO)).getValue();

        expect(answer[0].id.valueOf()).to.equal(1)
    });
    
});


function createAllData(codigoEdificioA: string, numeroPisoA: any, codigoEdificioB: string,
    numeroPisoB: any): Promise<Result<any>> {

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

    if (edificioA == null || edificioB == null || pisoA == null || pisoB == null ) {
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
