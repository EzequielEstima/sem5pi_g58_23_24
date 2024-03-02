import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { IElevadorPersistence } from "../../src/dataschema/IElevadorPersistence";
import ElevadorRepo from "../../src/repos/ElevadorRepo";
import { ElevadorMap } from "../../src/mappers/ElevadorMap";
import { IdElevador } from "../../src/domain/elevador/IdElevador";
import { DescricaoElevador } from "../../src/domain/elevador/DescricaoElevador";
import { Elevador } from "../../src/domain/elevador/Elevador";
import { MarcaElevador } from "../../src/domain/elevador/MarcaElevador";
import { ModeloElevador } from "../../src/domain/elevador/ModeloElevador";
import { NumeroSerieElevador } from "../../src/domain/elevador/NumeroSerieElevador";
import { DescricaoPiso } from "../../src/domain/piso/DescricaoPiso";
import { IdPiso } from "../../src/domain/piso/IdPiso";
import { NumeroPiso } from "../../src/domain/piso/NumeroPiso";
import { Piso } from "../../src/domain/piso/Piso";
import { Coordenadas } from "../../src/domain/ponto/Coordenadas";
import { IdPonto } from "../../src/domain/ponto/IdPonto";
import { Ponto } from "../../src/domain/ponto/Ponto";
import { TipoPonto } from "../../src/domain/ponto/TipoPonto";


describe('ElevadorRepo', () => {
    
    const sandbox = sinon.createSandbox();
    
    beforeEach(() => {
        Container.reset();

        let idElevador = IdElevador.create(1).getValue();
        let marcaElevador = MarcaElevador.create('123').getValue();
        let modeloElevador = ModeloElevador.create('123').getValue();
        let numeroSerieElevador = NumeroSerieElevador.create('123').getValue();
        let descricaoElevador = DescricaoElevador.create('123').getValue();

        // Criar 2 pisos
        let pisosServidos: Piso[]=[];

        for (let i = 1; i<= 2 ; i++){
            let descricaoPiso = DescricaoPiso.create("Piso"+i).getValue();
            let idPiso = IdPiso.create(i).getValue();
            let numeroPiso = NumeroPiso.create(i).getValue();
            let pontoArray  : Ponto[][] = [];
            let idPonto = IdPonto.create(i).getValue();
            let tipoPonto = TipoPonto.create(" ").getValue();
            let coordenadas = Coordenadas.create({abscissa: i , ordenada: i }).getValue();
            let ponto = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
            pontoArray[0] = []
            pontoArray[0][0] = ponto;
            let mapa;
            pisosServidos.push(Piso.create({
                numeroPiso: numeroPiso,
                descricaoPiso: descricaoPiso,
                mapa: mapa,
            }, idPiso).getValue())
        }

        let elevador = Elevador.create({
            pisosServidos: pisosServidos,
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, idElevador).getValue();


        Container.set("Elevador", elevador)

        let elevadorSchemaInstance = require('../../src/persistence/schemas/ElevadorSchema').default;
        Container.set("ElevadorSchema", elevadorSchemaInstance);

    });

    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });


    it('Exists deve retornar true', async () => {
        
        const elevadorSchemaInstance = Container.get("ElevadorSchema");

        sinon.stub(elevadorSchemaInstance,"findOne").returns(true);
        const elevadorRepo = new ElevadorRepo(elevadorSchemaInstance as any);
        const answer = await elevadorRepo.exists(Container.get("Elevador"));
        expect(answer).to.be.true;
    });


    it('Save deve retornar o elevador ao editar', async () => {
        
        const elevadorDTO ={
            domainId: 1,
            pisosServidos:[1,2],
            pontos: ["b.1.0","b.1.1","b.1.2","b.1.3"],
            marca: "345",
            modelo: "345",
            numeroSerie: "345",
            descricao: "345",
            save() { return this; }
        } as unknown as IElevadorPersistence & Document<any,any,any>;

        const elevadorSchemaInstance = Container.get("ElevadorSchema");
        const elevador = Container.get("Elevador") as Elevador;

        sinon.stub(elevadorSchemaInstance,"findOne").returns(elevadorDTO);

        const elevadorRepo = new ElevadorRepo(elevadorSchemaInstance as any);
        const answer = await elevadorRepo.save(elevador);

        expect(answer.returnIdElevador()).to.equal(elevador.returnIdElevador());
        expect(answer.returnIdPisosServidos()).to.deep.equal(elevador.returnIdPisosServidos());
        expect(answer.returnMarca()).to.equal(elevador.returnMarca());
        expect(answer.returnModelo()).to.equal(elevador.returnModelo());
        expect(answer.returnNumeroSerie()).to.equal(elevador.returnNumeroSerie());
        expect(answer.returnDescricao()).to.equal(elevador.returnDescricao());
    });


    it('findByDomainId deve retornar null', async () => {

    
        const elevadorDTO ={
            domainId: 1,
            pisosServidos:[1,2],
            pontos: ["b.1.0","b.1.1","b.1.2","b.1.3"],
            marca: "123",
            modelo: "123",
            numeroSerie: "123",
            descricao: "123",
            save() { return this; }
        } as unknown as IElevadorPersistence & Document<any,any,any>;


        const elevadorSchemaInstance = Container.get("ElevadorSchema");
        const elevador = Container.get("Elevador") as Elevador;
    
        sinon.stub(elevadorSchemaInstance, "findOne").returns(null);
        const elevadorRepo = new ElevadorRepo(elevadorSchemaInstance as any);
        const answer = await elevadorRepo.findByDomainId(elevadorDTO.domainId);
        
        expect(answer).to.equal(null);
        
    });

    it('getMaxId deve retornar 2', async () => {

    
        const elevadorDTO ={
            domainId: 1,
            pisosServidos:[1,2],
            pontos: ["b.1.0","b.1.1","b.1.2","b.1.3"],
            marca: "123",
            modelo: "123",
            numeroSerie: "123",
            descricao: "123",
            save() { return this; }
        } as unknown as IElevadorPersistence & Document<any,any,any>;

        const elevadorDTO2 ={
            domainId: 2,
            pisosServidos:[1,2],
            pontos: ["b.1.0","b.1.1","b.1.2","b.1.3"],
            marca: "123",
            modelo: "123",
            numeroSerie: "123",
            descricao: "123",
            save() { return this; }
        } as unknown as IElevadorPersistence & Document<any,any,any>;

        const elevadorSchemaInstance = Container.get("ElevadorSchema");
       
        sinon.stub(elevadorSchemaInstance, "find").returns([elevadorDTO,elevadorDTO2]);

        const elevadorRepo = new ElevadorRepo(elevadorSchemaInstance as any);
        const answer = await elevadorRepo.getMaxId();
        expect(answer).to.equal(2);

    });

    it('getMaxId deve retornar 0', async () => {


        const elevadorSchemaInstance = Container.get("ElevadorSchema");
       
        sinon.stub(elevadorSchemaInstance, "find").returns([]);

        const elevadorRepo = new ElevadorRepo(elevadorSchemaInstance as any);
        const answer = await elevadorRepo.getMaxId();
        expect(answer).to.equal(0);

    });
});