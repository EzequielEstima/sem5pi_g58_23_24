import { expect } from "chai";
import 'mocha';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { IPassagemPersistence } from "../../src/dataschema/IPassagemPersistence";
import PassagemRepo from "../../src/repos/PassagemRepo";
import { Result } from "../../src/core/logic/Result";
import { NumeroPiso } from "../../src/domain/piso/NumeroPiso";
import { DescricaoPiso } from "../../src/domain/piso/DescricaoPiso";
import { Piso } from "../../src/domain/piso/Piso";
import { Passagem } from "../../src/domain/passagem/Passagem";
import { IdPassagem } from "../../src/domain/passagem/IdPassagem";
import { IdPiso } from "../../src/domain/piso/IdPiso";
import { Document } from 'mongoose';
import { Mapa } from "../../src/domain/mapa/Mapa";


describe('PassagemRepo', () => {

    const sandbox = sinon.createSandbox();
    beforeEach(function() {
        this.timeout(10000);
        Container.reset();

        let passagemSchemaInstance = require('../../src/persistence/schemas/PassagemSchema').default;
        Container.set("PassagemSchema", passagemSchemaInstance);
        let pisoSchemaInstance = require('../../src/persistence/schemas/PisoSchema').default;
        Container.set("PisoSchema", pisoSchemaInstance);

        let pisoRepoClass = require('../../src/repos/PisoRepo').default;
        let pisoRepoInstance = Container.get(pisoRepoClass);
        Container.set("PisoRepo", pisoRepoInstance);
        let passagemRepoClass = require('../../src/repos/PassagemRepo').default;
        let passagemRepoInstance = Container.get(passagemRepoClass);
        Container.set("PassagemRepo", passagemRepoInstance);

    });
    
    afterEach(function() {
        sinon.restore();
        sandbox.restore();
    });

    it('Exists deve retornar true', async function () {

        const data = await createAllData();
        let pisoA = data.getValue().pisoA;
        let pisoB = data.getValue().pisoB;

        let id = IdPassagem.create(1).getValue();

        interface PassagemProps {
            pisoA: Piso;
            pisoB: Piso;
          }

        let body = {
            pisoA: pisoA,
            pisoB: pisoB,
        } as PassagemProps

        let passagem = Passagem.create(body, id).getValue();

        const passagemSchemaInstance = Container.get("PassagemSchema");

        sinon.stub(passagemSchemaInstance, "findOne").returns(true);
        const passagemRepo = new PassagemRepo(passagemSchemaInstance as any);
        const answer = await passagemRepo.exists(passagem);
        expect(answer).to.be.true;
    });

    it('Save deve retornar passagem', async function () {

        const data = await createAllData();
        let pisoA = data.getValue().pisoA;
        let pisoB = data.getValue().pisoB;

        let id = IdPassagem.create(1).getValue();

        let body = {
            pisoA: pisoA,
            pisoB: pisoB,
        }

        let passagemPersistence = {
            domainID: 1,
            pisoA: pisoA,
            pisoB: pisoB,
        } as IPassagemPersistence;

        let passagem = Passagem.create(body, id).getValue();

        const passagemSchemaInstance = Container.get("PassagemSchema");
        sinon.stub(passagemSchemaInstance, "findOne").returns(null);
        sinon.stub(passagemSchemaInstance, "create").returns(passagemPersistence as IPassagemPersistence);
        const repoStub = Container.get("PassagemRepo");
        const stub = sinon.stub(repoStub, 'getMaxId');
        stub.onCall(0).returns(Promise.resolve(1));
        const pisoRepo = Container.get("PisoRepo");
        const stubRepo = sinon.stub(pisoRepo, 'findByDomainId');
        stubRepo.onCall(0).returns(Promise.resolve(pisoA));
        stubRepo.onCall(1).returns(Promise.resolve(pisoB));

        const passagemRepo = new PassagemRepo(passagemSchemaInstance as any);
        const answer = await passagemRepo.save(passagem);
        expect(answer.id.toValue()).to.equal(passagem.id.toValue());
        expect(answer.props.pisoA.returnNumeroPiso()).to.equal(passagem.props.pisoA.returnNumeroPiso());
        expect(answer.props.pisoB.returnNumeroPiso()).to.equal(passagem.props.pisoB.returnNumeroPiso()); 
    });
 
    it('findByDomainId deve retornar passagem quando encontra', async () => {
    
        const data = await createAllData();
        let pisoA = data.getValue().pisoA;
        let pisoB = data.getValue().pisoB;

        let id = IdPassagem.create(1).getValue();

        let pisoRepo = Container.get("PisoRepo");
        let stubRepoPiso = sinon.stub(pisoRepo, 'save').returns(Promise.resolve(pisoA));
        stubRepoPiso.onCall(0).returns(Promise.resolve(pisoA));
        stubRepoPiso.onCall(1).returns(Promise.resolve(pisoB));

        let body = {
            pisoA: pisoA,
            pisoB: pisoB,
        }

        let passagem = Passagem.create(body, id).getValue();

        const passagemSchemaInstance = Container.get("PassagemSchema");
        sinon.stub(passagemSchemaInstance, "findOne").returns(passagem);
        const passagemRepo = new PassagemRepo(passagemSchemaInstance as any);
        const answer = await passagemRepo.findByDomainId(id);
        expect(answer.id.toValue()).to.equal(passagem.id.toValue());
        expect(answer.props.pisoA.returnNumeroPiso()).to.equal(passagem.props.pisoA.returnNumeroPiso());
        expect(answer.props.pisoB.returnNumeroPiso()).to.equal(passagem.props.pisoB.returnNumeroPiso());
    });

    it('findByDomainId deve retornar null on fail', async function () {
    
        let id = IdPassagem.create(1).getValue();

        const passagemSchemaInstance = Container.get("PassagemSchema");
        sinon.stub(passagemSchemaInstance, "findOne").returns(null);
        const passagemRepo = new PassagemRepo(passagemSchemaInstance as any);
        const answer = await passagemRepo.findByDomainId(id);
        expect(answer).to.equal(null);

    });


    it('getMaxId deve retornar 2', async () => {

        const data = await createAllData();
        let pisoA = data.getValue().pisoA;
        let pisoB = data.getValue().pisoB;

        let body1 = {
            domainID: 1,
            pisoA: pisoA,
            pisoB: pisoB,
            save() { return this; }
        } as unknown as IPassagemPersistence & Document<any, any, any>;
        let body2 = {
            domainID: 2,
            pisoA: pisoA,
            pisoB: pisoB,
            save() { return this; }
        } as unknown as IPassagemPersistence & Document<any, any, any> ;

        const passagemSchemaInstance = Container.get("PassagemSchema");
       
        sinon.stub(passagemSchemaInstance, "find").returns([body1,body2]);

        const passagemRepo = new PassagemRepo(passagemSchemaInstance as any);
        const answer = await passagemRepo.getMaxId();
        expect(answer).to.equal(2);

    });

    it('getMaxId deve retornar 0', async function () {

        const passagemSchemaInstance = Container.get("PassagemSchema");
       
        sinon.stub(passagemSchemaInstance, "find").returns([]);

        const passagemRepo = new PassagemRepo(passagemSchemaInstance as any);
        const answer = await passagemRepo.getMaxId();
        expect(answer).to.equal(0);

    });

});

function createAllData(): Promise<Result<any>> {

    interface pisoProps {
        numeroPiso: NumeroPiso;
        descricaoPiso: DescricaoPiso;
        mapa: Mapa;
    }

    // criar mapa
    let mapa ;

    // criar props pisos
    let pisoPropsA: pisoProps = {
        numeroPiso: NumeroPiso.create(1).getValue(),
        descricaoPiso: DescricaoPiso.create("Piso 1").getValue(),
        mapa: mapa,
    }
    let pisoPropsB: pisoProps = {
        numeroPiso: NumeroPiso.create(1).getValue(),
        descricaoPiso: DescricaoPiso.create("Piso 1").getValue(),
        mapa: mapa,
    }

    // criar pisos
    let pisoA = Piso.create(pisoPropsA,IdPiso.create(1).getValue()).getValue();
    let pisoB = Piso.create(pisoPropsB,IdPiso.create(2).getValue()).getValue();

    return Promise.resolve(Result.ok<any>({
        "pisoA": pisoA,
        "pisoB": pisoB,
    }));

}
