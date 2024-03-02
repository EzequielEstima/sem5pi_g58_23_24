/*
import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { IPontoPersistence } from "../../src/dataschema/IPontoPersistence";
import  IPontoDTO  from '../../src/dto/IPontoDTO';
import { PontoMap } from "../../src/mappers/PontoMap";
import PontoRepo from "../../src/repos/PontoRepo";

describe('PontoRepo', () => {

    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        
        Container.reset();

        let pontoSchemaInstance = require('../../src/persistence/schemas/PontoSchema').default;
        Container.set("PontoSchema", pontoSchemaInstance);

    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('Exists deve retornar true', async () => {

    
        const pontoDTO = {
            domainID: 1,
            abscissa: 1,
            ordenada: 1,
            tipoPonto: " "
        } as IPontoPersistence;

        const pisoSchemaInstance = Container.get("PontoSchema");

        sinon.stub(pisoSchemaInstance, "findOne").returns(pontoDTO);
        const pisoRepo = new PontoRepo(pisoSchemaInstance as any);
        const answer = await pisoRepo.exists(await PontoMap.toDomain(pontoDTO));
        expect(answer).to.be.true;
    });

    it('Save deve retornar ponto', async () => {

        const pontoDTO = {
            domainID: 1,
            abscissa: 1,
            ordenada: 1,
            tipoPonto: " "
        } as IPontoPersistence;

        const pontoSchemaInstance = Container.get("PontoSchema");
        const ponto = await PontoMap.toDomain(pontoDTO);
        sinon.stub(pontoSchemaInstance, "findOne").returns(null);
        sinon.stub(pontoSchemaInstance, "create").returns(pontoDTO as IPontoPersistence);
        const pisoRepo = new PontoRepo(pontoSchemaInstance as any);
        const answer = await pisoRepo.save(ponto);
        expect(answer.returnIdPonto()).to.equal(ponto.returnIdPonto());
        expect(answer.returnAbscissa()).to.equal(ponto.returnAbscissa());
        expect(answer.returnOrdenada()).to.equal(ponto.returnOrdenada());
        expect(answer.returnTipoPonto()).to.equal(ponto.returnTipoPonto());
        
    });


    it('Save deve retornar ponto ao editar', async () => {

    
        const pontoDTO1 = {
            domainID: 1,
            abscissa: 1,
            ordenada: 1,
            tipoPonto: " ",
            save() { return this; }
        } as unknown as IPontoPersistence & Document<any, any, any>;

        const pontoDTO2 = {
            domainID: 1,
            abscissa: 1,
            ordenada: 1,
            tipoPonto: "Norte"
        } as IPontoPersistence

        const pontoSchemaInstance = Container.get("PontoSchema");
        const ponto = await PontoMap.toDomain(pontoDTO2);
       
        sinon.stub(pontoSchemaInstance, "findOne").returns(pontoDTO1);
        const pontoRepo = new PontoRepo(pontoSchemaInstance as any);
        const answer = await pontoRepo.save(ponto);
        expect(answer.returnIdPonto()).to.equal(ponto.returnIdPonto());
        expect(answer.returnAbscissa()).to.equal(ponto.returnAbscissa());
        expect(answer.returnOrdenada()).to.equal(ponto.returnOrdenada());
        expect(answer.returnTipoPonto()).to.equal(ponto.returnTipoPonto());

    });

    it('findByDomainId deve retornar ponto quando encontra', async () => {

    
        const pontoDTO = {
            domainID: 1,
            abscissa: 1,
            ordenada: 1,
            tipoPonto: " ",
            save() { return this; }
        } as unknown as IPontoPersistence & Document<any, any, any>;


        const pontoSchemaInstance = Container.get("PontoSchema");
        const ponto = await PontoMap.toDomain(pontoDTO);
    
        sinon.stub(pontoSchemaInstance, "findOne").returns(pontoDTO);
        const pontoRepo = new PontoRepo(pontoSchemaInstance as any);
        const answer = await pontoRepo.findByDomainId(pontoDTO.domainID);
        expect(answer.returnIdPonto()).to.equal(ponto.returnIdPonto());
        expect(answer.returnAbscissa()).to.equal(ponto.returnAbscissa());
        expect(answer.returnOrdenada()).to.equal(ponto.returnOrdenada());
        expect(answer.returnTipoPonto()).to.equal(ponto.returnTipoPonto());

    });


    it('findByDomainId deve retornar null on fail', async () => {

    
        const pontoDTO = {
            domainID: 1,
            abscissa: 1,
            ordenada: 1,
            tipoPonto: " ",
            save() { return this; }
        } as unknown as IPontoPersistence & Document<any, any, any>;


        const pontoSchemaInstance = Container.get("PontoSchema");


        sinon.stub(pontoSchemaInstance, "findOne").returns(null);
        const pisoRepo = new PontoRepo(pontoSchemaInstance as any);
        const answer = await pisoRepo.findByDomainId(pontoDTO.domainID);
        expect(answer).to.equal(null);

    });
});
*/