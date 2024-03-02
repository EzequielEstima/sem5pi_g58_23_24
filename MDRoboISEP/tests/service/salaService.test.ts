import { expect } from "chai";
import 'mocha';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import SalaService from '../../src/services/ImplServices/SalaService';

import { Edificio } from "../../src/domain/edificio/Edificio";
import { Codigo } from '../../src/domain/edificio/Codigo';
import { Dimensao } from '../../src/domain/edificio/Dimensao';
import { DescricaoEdificio } from '../../src/domain/edificio/DescricaoEdificio';
import { Nome } from '../../src/domain/edificio/Nome';
import { Piso } from "../../src/domain/piso/Piso";
import { DescricaoPiso } from "../../src/domain/piso/DescricaoPiso";
import { NumeroPiso } from "../../src/domain/piso/NumeroPiso";
import IEdificioRepo from "../../src/services/IRepos/IEdificioRepo";
import { Result } from "../../src/core/logic/Result";
import { Elevador } from "../../src/domain/elevador/Elevador";
import { Sala } from "../../src/domain/sala/Sala";
import ISalaRepo from "../../src/services/IRepos/ISalaRepo";
import ISalaDTO from "../../src/dto/ISalaDTO";
import { Mapa } from "../../src/domain/mapa/Mapa";

describe('SalaService ', () => {


    const sandbox = sinon.createSandbox();
    beforeEach(() => {

        Container.reset();

        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let passagemSchemaInstance = require('../../src/persistence/schemas/PassagemSchema').default;
        Container.set("PassagemSchema", passagemSchemaInstance);

        let passagemRepoClass = require('../../src/repos/PassagemRepo').default;
        let passagemRepoInstance = Container.get(passagemRepoClass);
        Container.set("PassagemRepo", passagemRepoInstance);

        let edificioRepoClass = require('../../src/repos/EdificioRepo').default;
        let edificioRepoInstance = Container.get(edificioRepoClass);
        Container.set("EdificioRepo", edificioRepoInstance);

    });

    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('Sala criada com sucesso', async () => {

        let body = {
            id: "B300",
            codigoEdificio: "COD",
            numeroPiso: 0,
            descricao: "Sala B300 - Laboratorio de Informatica",
            categoria: "Laboratorio",
        }
    

        let data = await createAllData(body.codigoEdificio, body.numeroPiso);

        const edificioA = data.getValue().edificioA

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificioA));
        let salaRepo = Container.get("SalaRepo") as ISalaRepo;
        let stubSalaRepo = sinon.stub(salaRepo, 'findByDomainId');
        stubSalaRepo.onCall(0).returns(null);
        let stubRepo2 = sinon.stub(salaRepo, 'save');
        stubRepo2.onCall(0).returns(Promise.resolve(Sala));



        const salaService = new SalaService(edificioRepo, salaRepo);

        let answer = await salaService.criarSala(body as ISalaDTO);
        expect(answer.isSuccess).to.equal(true);
    });

    it('Sala já existe', async () => {

        let body = {
            id: "B300",
            codigoEdificio: "COD",
            numeroPiso: 0,
            descricao: "Sala B300 - Laboratorio de Informatica",
            categoria: "Laboratorio",
        }
    
        let data = await createAllData(body.codigoEdificio, body.numeroPiso);

        const edificioA = data.getValue().edificioA
        
        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificioA));
        let salaRepo = Container.get("SalaRepo") as ISalaRepo;
        let stubSalaRepo = sinon.stub(salaRepo, 'findByDomainId');
        stubSalaRepo.onCall(0).returns(body as ISalaDTO);
        let stubRepo2 = sinon.stub(salaRepo, 'save');
        stubRepo2.onCall(0).returns(Promise.resolve(Sala));

        const salaService = new SalaService(edificioRepo, salaRepo);

        let answer = await salaService.criarSala(body as ISalaDTO);
        expect(answer.errorValue()).to.equal("Sala já existe")
    });

    it('Sala não pode ser criada porque edificio não existe', async () => {
      
        let body = {
            id: "B300",
            codigoEdificio: "COD",
            numeroPiso: 0,
            descricao: "Sala B300 - Laboratorio de Informatica",
            categoria: "Laboratorio",
        }
    
        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(null));
        let salaRepo = Container.get("SalaRepo") as ISalaRepo;
        let stubSalaRepo = sinon.stub(salaRepo, 'findByDomainId');
        stubSalaRepo.onCall(0).returns(null);
        let stubRepo2 = sinon.stub(salaRepo, 'save');
        stubRepo2.onCall(0).returns(Promise.resolve(Sala));

        const salaService = new SalaService(edificioRepo, salaRepo);

        let answer = await salaService.criarSala(body as ISalaDTO);
        expect(answer.errorValue()).to.equal("Edificio não existe")
    });

    it('Sala não pode ser criada porque piso não existe', async () => {

        let body = {
            id: "B300",
            codigoEdificio: "COD",
            numeroPiso: 1,
            descricao: "Sala B300 - Laboratorio de Informatica",
            categoria: "Laboratorio",
        }
    
        let data = await createAllData(body.codigoEdificio, 0);

        const edificioA = data.getValue().edificioA

        let edificioRepo = Container.get("EdificioRepo") as IEdificioRepo;
        let stubRepo = sinon.stub(edificioRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(edificioA));
        let salaRepo = Container.get("SalaRepo") as ISalaRepo;
        let stubSalaRepo = sinon.stub(salaRepo, 'findByDomainId');
        stubSalaRepo.onCall(0).returns(null);
        let stubRepo2 = sinon.stub(salaRepo, 'save');
        stubRepo2.onCall(0).returns(Promise.resolve(Sala));

        const salaService = new SalaService(edificioRepo, salaRepo);

        let answer = await salaService.criarSala(body as ISalaDTO);
        expect(answer.errorValue()).to.equal("Piso não existe")

    });

});


function createAllData(codigoEdificioA: string, numeroPisoA: any): Promise<Result<any>> {

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

    // criar codigos edificios
    let codigoEdificio = Codigo.create(codigoEdificioA).getValue();
    // criar edificios
    let edificioA = Edificio.create(edificioPropsA, codigoEdificio).getValue();

    // criar mapa
    let mapa;

    // criar props pisos
    let pisoPropsA: pisoProps = {
        numeroPiso: NumeroPiso.create(numeroPisoA).getValue(),
        descricaoPiso: DescricaoPiso.create("Piso 1").getValue(),
        mapa: mapa,
    }

    // criar pisos
    let pisoA = Piso.create(pisoPropsA).getValue();

    // adicionar pisos aos edificios
    edificioA.addPiso(pisoA);

    if (edificioA == null || pisoA == null ) {
        return Promise.resolve(Result.fail<void>("Erro ao criar dados de test"));
    }

    return Promise.resolve(Result.ok<any>({
        "edificioA": edificioA,
    }));

}
