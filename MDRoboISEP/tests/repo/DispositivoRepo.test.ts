import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { IDispositivoPersistence } from "../../src/dataschema/IDispositivoPersistence";
import { DispositivoMap } from "../../src/mappers/DispositivoMap";
import DispositivoRepo from "../../src/repos/DispositivoRepo";
import TipoDispositivoRepo from "../../src/repos/TipoDispositivoRepo";
import { TipoTarefa } from "../../src/domain/tipoDispositivo/TipoTarefa";
import { Marca } from "../../src/domain/tipoDispositivo/Marca";
import { Modelo } from "../../src/domain/tipoDispositivo/Modelo";
import { TipoDispositivo } from "../../src/domain/tipoDispositivo/TipoDispositivo";
import { IdTipoDispositivo } from "../../src/domain/tipoDispositivo/IdTipoDispositivo";

describe('DispositivoRepo', () => {

    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        
        Container.reset();

        let tipoDispositivoProps : any = {
            tipoTarefa: [TipoTarefa.create('Vigilancia').getValue()],
            marca: Marca.create('Marca').getValue(),
            modelo: Modelo.create('Modelo').getValue(),
        }
        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps,IdTipoDispositivo.create(1).getValue()).getValue();
        Container.set("tipoDispositivo", tipoDispositivo);

        let dispositivoSchemaInstance = require('../../src/persistence/schemas/DispositivoSchema').default;
        Container.set("DispositivoSchema", dispositivoSchemaInstance);

        let tipoDispositivoRepoClass = require('../../src/repos/TipoDispositivoRepo').default;
        let tipoDispositivoRepoInstance = Container.get(tipoDispositivoRepoClass);
        Container.set("TipoDispositivoRepo", tipoDispositivoRepoInstance);
    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('Exists deve retornar true caso exista', async () => {

        const dispositivoPersistence = {
            codigo: "AS1",
            descricaoDispositivo: "AS1",
            estado: true,
            nickname: "ola",
            numeroSerie: "asas",
            tipoDeDispositivo: 1,
        } as IDispositivoPersistence;

        const dispositivoSchemaInstance = Container.get("DispositivoSchema");
        const tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(dispositivoSchemaInstance, "findOne").returns(dispositivoPersistence);

        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));
        const dispositivoRepo = new DispositivoRepo(dispositivoSchemaInstance as any);
        const answer = await dispositivoRepo.exists(await DispositivoMap.toDomain(dispositivoPersistence));
        expect(answer).to.be.true;
    });

    it('Exists deve retornar false caso não exista', async () => {

        const dispositivoPersistence = {
            codigo: "AS1",
            descricaoDispositivo: "AS1",
            estado: true,
            nickname: "ola",
            numeroSerie: "asas",
            tipoDeDispositivo: 1,
        } as IDispositivoPersistence;

        const dispositivoSchemaInstance = Container.get("DispositivoSchema");
        const tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(dispositivoSchemaInstance, "findOne").returns();
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));

        const dispositivoRepo = new DispositivoRepo(dispositivoSchemaInstance as any);
        const answer = await dispositivoRepo.exists(await DispositivoMap.toDomain(dispositivoPersistence));
        expect(answer).to.be.false;
    });



    it('Save deve retornar dispositivo', async () => {

        const dispositivoPersistence = {
            codigo: "AS1",
            descricaoDispositivo: "AS1",
            estado: true,
            nickname: "ola",
            numeroSerie: "asas",
            tipoDeDispositivo: 1,
        } as IDispositivoPersistence;

        const dispositivoSchemaInstance = Container.get("DispositivoSchema");
        const tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));


        const dispositivo = await DispositivoMap.toDomain(dispositivoPersistence);

        sinon.stub(dispositivoSchemaInstance, "findOne").returns(null);
        sinon.stub(dispositivoSchemaInstance, "create").returns(dispositivoPersistence as IDispositivoPersistence);
        const dispositivoRepo = new DispositivoRepo(dispositivoSchemaInstance as any);
        const answer = await dispositivoRepo.save(dispositivo);
        expect(answer.returnCodigoDispositivo()).to.equal(dispositivo.returnCodigoDispositivo());
        expect(answer.returnEstado()).to.equal(dispositivo.returnEstado());
        expect(answer.returnNickname()).to.equal(dispositivo.returnNickname());
        expect(answer.returnNumeroSerie()).to.equal(dispositivo.returnNumeroSerie());
        expect(answer.props.tipoDeDispositivo.returnIdTipoDispositivo()).to.equal(dispositivo.props.tipoDeDispositivo.returnIdTipoDispositivo());
        expect(answer.returnDescricaoDispositivo()).to.equal(dispositivo.returnDescricaoDispositivo());
    });

    it('Save deve retornar dispositivo ao editar', async () => {

    
        const dispositivoPersistence1 = {
            codigo: "AS1",
            descricaoDispositivo: "AS1",
            estado: true,
            nickname: "ola",
            numeroSerie: "asas",
            tipoDeDispositivo: 1,
            save() { return this; } 
        } as IDispositivoPersistence & Document<any, any, any>;

        const dispositivoPersistence2 = {
            codigo: "AS1",
            descricaoDispositivo: "AS1as",
            estado: true,
            nickname: "oladsd",
            numeroSerie: "asasasdwq",
            tipoDeDispositivo: 1,
        } as IDispositivoPersistence ;
        

        const dispositivoSchemaInstance = Container.get("DispositivoSchema");
        const tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));


        const dispositivo = await DispositivoMap.toDomain(dispositivoPersistence2);

        sinon.stub(dispositivoSchemaInstance, "findOne").returns(dispositivoPersistence1);
        const dispositivoRepo = new DispositivoRepo(dispositivoSchemaInstance as any);
        const answer = await dispositivoRepo.save(dispositivo);
        expect(answer.returnCodigoDispositivo()).to.equal(dispositivo.returnCodigoDispositivo());
        expect(answer.returnEstado()).to.equal(dispositivo.returnEstado());
        expect(answer.returnNickname()).to.equal(dispositivo.returnNickname());
        expect(answer.returnNumeroSerie()).to.equal(dispositivo.returnNumeroSerie());
        expect(answer.props.tipoDeDispositivo.returnIdTipoDispositivo()).to.equal(dispositivo.props.tipoDeDispositivo.returnIdTipoDispositivo());
        expect(answer.returnDescricaoDispositivo()).to.equal(dispositivo.returnDescricaoDispositivo());

    });

    it('findByDomainId deve retornar dispositivo quando encontra', async () => {

       
        const dispositivoPersistence = {
            codigo: "AS1",
            descricaoDispositivo: "AS1",
            estado: true,
            nickname: "ola",
            numeroSerie: "asas",
            tipoDeDispositivo: 1,
            save() { return this; } 
        } as IDispositivoPersistence & Document<any, any, any>;
        
        
        const dispositivoSchemaInstance = Container.get("DispositivoSchema");
        const tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));

        const dispositivo = await DispositivoMap.toDomain(dispositivoPersistence);

        sinon.stub(dispositivoSchemaInstance, "findOne").returns(dispositivoPersistence);
        const dispositivoRepo = new DispositivoRepo(dispositivoSchemaInstance as any);
        const answer = await dispositivoRepo.findByDomainId(dispositivoPersistence.codigo);
        
        expect(answer.returnCodigoDispositivo()).to.equal(dispositivo.returnCodigoDispositivo());
        expect(answer.returnEstado()).to.equal(dispositivo.returnEstado());
        expect(answer.returnNickname()).to.equal(dispositivo.returnNickname());
        expect(answer.returnNumeroSerie()).to.equal(dispositivo.returnNumeroSerie());
        expect(answer.props.tipoDeDispositivo.returnIdTipoDispositivo()).to.equal(dispositivo.props.tipoDeDispositivo.returnIdTipoDispositivo());
        expect(answer.returnDescricaoDispositivo()).to.equal(dispositivo.returnDescricaoDispositivo());

    });


    it('findByDomainId deve retornar null quando falha', async () => {

    
        const dispositivoPersistence = {
            codigo: "AS1",
            descricaoDispositivo: "AS1",
            estado: true,
            nickname: "ola",
            numeroSerie: "asas",
            tipoDeDispositivo: 1,
            save() { return this; } 
        } as IDispositivoPersistence & Document<any, any, any>;
        
        
        const dispositivoSchemaInstance = Container.get("DispositivoSchema");
        const tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));

        sinon.stub(dispositivoSchemaInstance, "findOne").returns(null);
        const dispositivoRepo = new DispositivoRepo(dispositivoSchemaInstance as any);
        const answer = await dispositivoRepo.findByDomainId(dispositivoPersistence.codigo);
        
        expect(answer).to.equal(null);

    });


    it('findByNickname deve retornar dispositivo quando encontra', async () => {

       
        const dispositivoPersistence = {
            codigo: "AS1",
            descricaoDispositivo: "AS1",
            estado: true,
            nickname: "ola",
            numeroSerie: "asas",
            tipoDeDispositivo: 1,
            save() { return this; } 
        } as IDispositivoPersistence & Document<any, any, any>;
        
        
        const dispositivoSchemaInstance = Container.get("DispositivoSchema");
        const tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));

        const dispositivo = await DispositivoMap.toDomain(dispositivoPersistence);

        sinon.stub(dispositivoSchemaInstance, "findOne").returns(dispositivoPersistence);
        const dispositivoRepo = new DispositivoRepo(dispositivoSchemaInstance as any);
        const answer = await dispositivoRepo.findByNickname(dispositivoPersistence.codigo);
        
        expect(answer.returnCodigoDispositivo()).to.equal(dispositivo.returnCodigoDispositivo());
        expect(answer.returnEstado()).to.equal(dispositivo.returnEstado());
        expect(answer.returnNickname()).to.equal(dispositivo.returnNickname());
        expect(answer.returnNumeroSerie()).to.equal(dispositivo.returnNumeroSerie());
        expect(answer.props.tipoDeDispositivo.returnIdTipoDispositivo()).to.equal(dispositivo.props.tipoDeDispositivo.returnIdTipoDispositivo());
        expect(answer.returnDescricaoDispositivo()).to.equal(dispositivo.returnDescricaoDispositivo());

    });


    it('findByNickname deve retornar null quando falha', async () => {

    
        const dispositivoPersistence = {
            codigo: "AS1",
            descricaoDispositivo: "AS1",
            estado: true,
            nickname: "ola",
            numeroSerie: "asas",
            tipoDeDispositivo: 1,
            save() { return this; } 
        } as IDispositivoPersistence & Document<any, any, any>;
        
        
        const dispositivoSchemaInstance = Container.get("DispositivoSchema");
        const tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));

        sinon.stub(dispositivoSchemaInstance, "findOne").returns(null);
        const dispositivoRepo = new DispositivoRepo(dispositivoSchemaInstance as any);
        const answer = await dispositivoRepo.findByNickname(dispositivoPersistence.codigo);
        
        expect(answer).to.equal(null);

    });

    it('findByNumeroSerie deve retornar dispositivo quando encontra', async () => {

       
        const dispositivoPersistence = {
            codigo: "AS1",
            descricaoDispositivo: "AS1",
            estado: true,
            nickname: "ola",
            numeroSerie: "asas",
            tipoDeDispositivo: 1,
        } as IDispositivoPersistence;
        
        
        const dispositivoSchemaInstance = Container.get("DispositivoSchema");
        const tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));

        const dispositivo = await DispositivoMap.toDomain(dispositivoPersistence);

        sinon.stub(dispositivoSchemaInstance, "find").returns([dispositivoPersistence]);
        const dispositivoRepo = new DispositivoRepo(dispositivoSchemaInstance as any);
        const answer = await dispositivoRepo.findByNumeroSerie(dispositivoPersistence.codigo);
        
        expect(answer[0].returnCodigoDispositivo()).to.equal(dispositivo.returnCodigoDispositivo());
        expect(answer[0].returnEstado()).to.equal(dispositivo.returnEstado());
        expect(answer[0].returnNickname()).to.equal(dispositivo.returnNickname());
        expect(answer[0].returnNumeroSerie()).to.equal(dispositivo.returnNumeroSerie());
        expect(answer[0].props.tipoDeDispositivo.returnIdTipoDispositivo()).to.equal(dispositivo.props.tipoDeDispositivo.returnIdTipoDispositivo());
        expect(answer[0].returnDescricaoDispositivo()).to.equal(dispositivo.returnDescricaoDispositivo());

    });


    it('findByNumeroSerie deve retornar null quando falha', async () => {

    
        const dispositivoPersistence = {
            codigo: "AS1",
            descricaoDispositivo: "AS1",
            estado: true,
            nickname: "ola",
            numeroSerie: "asas",
            tipoDeDispositivo: 1,
            save() { return this; } 
        } as IDispositivoPersistence & Document<any, any, any>;
        
        
        const dispositivoSchemaInstance = Container.get("DispositivoSchema");
        const tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));

        sinon.stub(dispositivoSchemaInstance, "find").returns([]);
        const dispositivoRepo = new DispositivoRepo(dispositivoSchemaInstance as any);
        const answer = await dispositivoRepo.findByNumeroSerie(dispositivoPersistence.codigo);
        
        expect(answer.length).to.equal(0);

    });

    it('findAll deve retornar dispositivo quando encontra', async () => {

       
        const dispositivoPersistence = {
            codigo: "AS1",
            descricaoDispositivo: "AS1",
            estado: true,
            nickname: "ola",
            numeroSerie: "asas",
            tipoDeDispositivo: 1,
        } as IDispositivoPersistence;

        const dispositivoPersistence2 = {
            codigo: "AS2",
            descricaoDispositivo: "AS2",
            estado: true,
            nickname: "ola2",
            numeroSerie: "asas2",
            tipoDeDispositivo: 1,
        } as IDispositivoPersistence;
        
        
        const dispositivoSchemaInstance = Container.get("DispositivoSchema");
        const tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        
        sinon.stub(dispositivoSchemaInstance, "find").returns([dispositivoPersistence,dispositivoPersistence2]);

        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));

        const dispositivo = await DispositivoMap.toDomain(dispositivoPersistence);
        const dispositivo2 = await DispositivoMap.toDomain(dispositivoPersistence2);

        const dispositivoRepo = new DispositivoRepo(dispositivoSchemaInstance as any);
        const answer = await dispositivoRepo.findByNumeroSerie(dispositivoPersistence.codigo);
        
        expect(answer[0].returnCodigoDispositivo()).to.equal(dispositivo.returnCodigoDispositivo());
        expect(answer[0].returnEstado()).to.equal(dispositivo.returnEstado());
        expect(answer[0].returnNickname()).to.equal(dispositivo.returnNickname());
        expect(answer[0].returnNumeroSerie()).to.equal(dispositivo.returnNumeroSerie());
        expect(answer[0].props.tipoDeDispositivo.returnIdTipoDispositivo()).to.equal(dispositivo.props.tipoDeDispositivo.returnIdTipoDispositivo());
        expect(answer[0].returnDescricaoDispositivo()).to.equal(dispositivo.returnDescricaoDispositivo());

        expect(answer[1].returnCodigoDispositivo()).to.equal(dispositivo2.returnCodigoDispositivo());
        expect(answer[1].returnEstado()).to.equal(dispositivo2.returnEstado());
        expect(answer[1].returnNickname()).to.equal(dispositivo2.returnNickname());
        expect(answer[1].returnNumeroSerie()).to.equal(dispositivo2.returnNumeroSerie());
        expect(answer[1].props.tipoDeDispositivo.returnIdTipoDispositivo()).to.equal(dispositivo2.props.tipoDeDispositivo.returnIdTipoDispositivo());
        expect(answer[1].returnDescricaoDispositivo()).to.equal(dispositivo2.returnDescricaoDispositivo());

    });

    it('findAll deve retornar lista vazia quando não existem dispositivos ', async () => {

        const dispositivoSchemaInstance = Container.get("DispositivoSchema");
        const tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));

        sinon.stub(dispositivoSchemaInstance, "find").returns([]);
        const dispositivoRepo = new DispositivoRepo(dispositivoSchemaInstance as any);
        const answer = await dispositivoRepo.findAll();
        
        expect(answer.length).to.equal(0);

    });

 
});
