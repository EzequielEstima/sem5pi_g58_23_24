import * as sinon from 'sinon';
import Container from 'typedi';
import IEdificioDTO from '../../src/dto/IEdificioDTO';
import { IEdificioPersistence } from "../../src/dataschema/IEdificioPersistence";
import { EdificioMap } from "../../src/mappers/EdificioMap";
import EdificioRepo from '../../src/repos/EdificioRepo';
import { expect } from 'chai';
import { Document } from 'mongoose';
import e from 'express';
import 'mocha';

describe('EdificioRepo', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        Container.reset();

        let edificioSchemaInstance = require('../../src/persistence/schemas/EdificioSchema').default;
        Container.set("EdificioSchema", edificioSchemaInstance);

        let elevadorSchemaInstance = require('../../src/persistence/schemas/ElevadorSchema').default;
        Container.set("ElevadorSchema", elevadorSchemaInstance);

        let pisoSchemaInstance = require('../../src/persistence/schemas/PisoSchema').default;
        Container.set("PisoSchema", pisoSchemaInstance);
    });
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('Exists deve retornar true se o edificio existir', async () => {
        let listaPiso : number [] = []; 

        const edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : listaPiso,
        } as IEdificioPersistence

        const edificioSchemaInstance = Container.get("EdificioSchema");

        sinon.stub(edificioSchemaInstance, "findOne").returns(edificioDTO as IEdificioPersistence);
        const edificioRepo = new EdificioRepo(edificioSchemaInstance as any);
        const answer = await edificioRepo.exists(await EdificioMap.toDomain(edificioDTO));
        expect(answer).to.be.true;
    });

    it('Save deve retornar edificio', async () => {
        let listaPiso : number [] = []; 
        const edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : listaPiso,
        } as IEdificioPersistence

        const edificioSchemaInstance = Container.get("EdificioSchema");
    
        sinon.stub(edificioSchemaInstance, "findOne").returns(null);
        sinon.stub(edificioSchemaInstance, "create").returns(edificioDTO as IEdificioPersistence);
        const edificioRepo = new EdificioRepo(edificioSchemaInstance as any);
        const edificio = await EdificioMap.toDomain(edificioDTO);
        const answer = await edificioRepo.save(edificio);
        expect(answer.returnEdificioId()).to.be.equal(edificio.returnEdificioId());
        expect(answer.returnNome()).to.be.equal(edificio.returnNome());
        expect(answer.returnDescricao()).to.be.equal(edificio.returnDescricao());
        expect(answer.returnDimensaoX()).to.be.equal(edificio.returnDimensaoX());
        expect(answer.returnDimensaoY()).to.be.equal(edificio.returnDimensaoY());
        expect(answer.returnListaPisosId()).to.deep.equal(edificio.returnListaPisosId());
    });

    it('Save dever retorna edificio ao editar', async () => {
        let listaPiso : number [] = []; 
        const edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : listaPiso,
            save() { return this; }
        } as IEdificioPersistence & Document<any, any, any>;

        const edificioDTO2 = {
            codigo : "ED01",
            nome : "Edificio B",
            descricao : "Edificio B",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : listaPiso,
        } as IEdificioPersistence
        
        const edificioSchemaInstance = Container.get("EdificioSchema");
    
        sinon.stub(edificioSchemaInstance, "findOne").returns(edificioDTO);
        const edificioRepo = new EdificioRepo(edificioSchemaInstance as any);

        const edificio = await EdificioMap.toDomain(edificioDTO2);
        const answer = await edificioRepo.save(edificio);

        expect(answer.returnEdificioId()).to.be.equal(edificio.returnEdificioId());
        expect(answer.returnNome()).to.be.equal(edificio.returnNome());
        expect(answer.returnDescricao()).to.be.equal(edificio.returnDescricao());
        expect(answer.returnDimensaoX()).to.be.equal(edificio.returnDimensaoX());
        expect(answer.returnDimensaoY()).to.be.equal(edificio.returnDimensaoY());
        expect(answer.returnListaPisosId()).to.deep.equal(edificio.returnListaPisosId());
    });

    it('FindbyDomainId deve retornar ediificio', async () => {
        let listaPiso : number [] = []; 
        const edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : listaPiso,
            save() { return this; }
        } as IEdificioPersistence & Document<any, any, any>;

        const edificioSchemaInstance = Container.get("EdificioSchema");
        sinon.stub(edificioSchemaInstance, "findOne").returns(edificioDTO);
        const edificioRepo = new EdificioRepo(edificioSchemaInstance as any);

        const edificio = await EdificioMap.toDomain(edificioDTO);
        const answer = await edificioRepo.findByDomainId(edificioDTO.codigo);

        expect(answer.returnEdificioId()).to.be.equal(edificio.returnEdificioId());
        expect(answer.returnNome()).to.be.equal(edificio.returnNome());
        expect(answer.returnDescricao()).to.be.equal(edificio.returnDescricao());
        expect(answer.returnDimensaoX()).to.be.equal(edificio.returnDimensaoX());
        expect(answer.returnDimensaoY()).to.be.equal(edificio.returnDimensaoY());
        expect(answer.returnListaPisosId()).to.deep.equal(edificio.returnListaPisosId());
    });

    it('FindByDomainId deve retornar null se não encontrar nada', async () => {
        let listaPiso : number [] = []; 
        const edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : listaPiso,
            save() { return this; }
        } as IEdificioPersistence & Document<any, any, any>;

        const edificioSchemaInstance = Container.get("EdificioSchema");
        sinon.stub(edificioSchemaInstance, "findOne").returns(null);
        const edificioRepo = new EdificioRepo(edificioSchemaInstance as any);

        const edificio = await EdificioMap.toDomain(edificioDTO);
        const answer = await edificioRepo.findByDomainId(edificioDTO.codigo);

        expect(answer).to.be.equal(null);
    });

    it('GetAllEdificios deve retornar lista vazia se não encontrar nada', async () => {
        const edificioSchemaInstance = Container.get("EdificioSchema");
        sinon.stub(edificioSchemaInstance, "find").returns([]);
        const edificioRepo = new EdificioRepo(edificioSchemaInstance as any);

        const answer = await edificioRepo.getAllEdificios();

        expect(answer).to.be.deep.equal([]);
    });

    it('GetAllEdificios deve retornar lista de edificios', async () => {
        let listaPiso : number [] = []; 
        const edificioDTO = {
            codigo : "ED01",
            nome : "Edificio A",
            descricao : "Edificio A",
            dimensaoX: 1,
            dimensaoY: 1,
            piso : listaPiso,
            save() { return this; }
        } as IEdificioPersistence & Document<any, any, any>;

        const edificioSchemaInstance = Container.get("EdificioSchema");
        sinon.stub(edificioSchemaInstance, "find").returns([edificioDTO]);
        const edificioRepo = new EdificioRepo(edificioSchemaInstance as any);

        const answer = await edificioRepo.getAllEdificios();

        expect(answer[0].returnEdificioId()).to.be.equal(edificioDTO.codigo);
        expect(answer[0].returnNome()).to.be.equal(edificioDTO.nome);
        expect(answer[0].returnDescricao()).to.be.equal(edificioDTO.descricao);
        expect(answer[0].returnDimensaoX()).to.be.equal(edificioDTO.dimensaoX);
        expect(answer[0].returnDimensaoY()).to.be.equal(edificioDTO.dimensaoY);
        expect(answer[0].returnListaPisosId()).to.deep.equal(edificioDTO.piso);
    });
});
