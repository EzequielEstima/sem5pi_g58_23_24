import { expect } from "chai";
import 'mocha';
import { Document } from 'mongoose';
import "reflect-metadata";
import * as sinon from 'sinon';
import { Container } from 'typedi';
import DispositivoService from '../../src/services/ImplServices/DispositivoService';
import ITipoDispositivoRepo from "../../src/services/IRepos/ITipoDispositivoRepo";
import IDispositivoRepo from "../../src/services/IRepos/IDispositivoRepo";
import IAdicionarRoboAFrotaDTO from "../../src/dto/IAdicionarRoboAFrotaDTO";
import { TipoTarefa } from "../../src/domain/tipoDispositivo/TipoTarefa";
import { Marca } from "../../src/domain/tipoDispositivo/Marca";
import { Modelo } from "../../src/domain/tipoDispositivo/Modelo";
import { TipoDispositivo } from "../../src/domain/tipoDispositivo/TipoDispositivo";
import { IdTipoDispositivo } from "../../src/domain/tipoDispositivo/IdTipoDispositivo";
import { DescricaoDispositivo } from "../../src/domain/dispositivo/DescricaoDispositivo";
import { Nickname } from "../../src/domain/dispositivo/Nickname";
import { NumeroDeSerie } from "../../src/domain/dispositivo/NumeroDeSerie";
import { EstadoDispositivo } from "../../src/domain/dispositivo/EstadoDispositivo";
import { Dispositivo } from "../../src/domain/dispositivo/Dispositivo";
import { CodigoDispositivo } from "../../src/domain/dispositivo/CodigoDispositivo";
import { ITipoDispositivoPersistence } from "../../src/dataschema/ITipoDispositivoPersistence";
import { IDispositivoPersistence } from "../../src/dataschema/IDispositivoPersistence";
import DispositivoRepo from "../../src/repos/DispositivoRepo";
import TipoDispositivoRepo from "../../src/repos/TipoDispositivoRepo";
import { DispositivoMap } from "../../src/mappers/DispositivoMap";


describe('DispositivoService ', () => {

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

        let dispositivoProps : any = {
            descricaoDispositivo: DescricaoDispositivo.create("asdasdqwe123").getValue(),
            estado: EstadoDispositivo.create(true).getValue(),
            nickname: Nickname.create("ola").getValue(),
            numeroSerie: NumeroDeSerie.create("123456789").getValue(),
            tipoDeDispositivo: tipoDispositivo,
        };
        const dispositivo = Dispositivo.create(dispositivoProps,CodigoDispositivo.create("as1").getValue()).getValue();
        Container.set("dispositivo", dispositivo);

        let dispositivoSchemaInstance = require('../../src/persistence/schemas/DispositivoSchema').default;
        Container.set("DispositivoSchema", dispositivoSchemaInstance);

        let tipoDispositivoSchemaInstance = require('../../src/persistence/schemas/TipoDispositivoSchema').default;
        Container.set("TipoDispositivo", tipoDispositivoSchemaInstance);

        let dispositivoRepoClass = require('../../src/repos/DispositivoRepo').default;
        let dispositivoRepoInstance = Container.get(dispositivoRepoClass);
        Container.set("DispositivoRepo", dispositivoRepoInstance);

        let tipoDispositivoRepoClass = require('../../src/repos/TipoDispositivoRepo').default;
        let tipoDispositivoRepoInstance = Container.get(tipoDispositivoRepoClass);
        Container.set("TipoDispositivoRepo", tipoDispositivoRepoInstance);

    });
    
    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('Tipo de dispositivo não existe', async () => {
        
        let body = {
            "codigo": "as1",
            "descricaoDispositivo": "asdasdqwe123",
            "nickname": "ola",
            "tipoDispositivo": 1,
            "numeroSerie": "123456789"
        };


        let dispositivoRepoInstance = Container.get("DispositivoRepo");
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");


        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        const dispositivoService = new DispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo,dispositivoRepoInstance as IDispositivoRepo);
        const answer = await dispositivoService.adicionarDispositivoAFrota(body as IAdicionarRoboAFrotaDTO);
        expect(answer.errorValue()).to.equal("O tipo de dispositivo com o id 1 não existe");

    });

    it('Já existe dispositivo com o codigo', async () => {
        
        let body = {
            "codigo": "as1",
            "descricaoDispositivo": "asdasdqwe123",
            "nickname": "ola",
            "tipoDispositivo": 1,
            "numeroSerie": "123456789"
        };


        let dispositivoRepoInstance = Container.get("DispositivoRepo");
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));
        sinon.stub(dispositivoRepoInstance, "findByDomainId").returns(Promise.resolve(Container.get("dispositivo")));


        const dispositivoService = new DispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo,dispositivoRepoInstance as IDispositivoRepo);
        const answer = await dispositivoService.adicionarDispositivoAFrota(body as IAdicionarRoboAFrotaDTO);
        expect(answer.errorValue()).to.equal("O dispositivo com o codigo as1 já existe");

    });

    it('Já existe o nickname', async () => {
        
        let body = {
            "codigo": "as1",
            "descricaoDispositivo": "asdasdqwe123",
            "nickname": "ola",
            "tipoDispositivo": 1,
            "numeroSerie": "123456789"
        };


        let dispositivoRepoInstance = Container.get("DispositivoRepo");
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));
        sinon.stub(dispositivoRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        sinon.stub(dispositivoRepoInstance, "findByNickname").returns(Promise.resolve(Container.get("dispositivo")));

        const dispositivoService = new DispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo,dispositivoRepoInstance as IDispositivoRepo);
        const answer = await dispositivoService.adicionarDispositivoAFrota(body as IAdicionarRoboAFrotaDTO);
        expect(answer.errorValue()).to.equal("O dispositivo com o nickname ola já existe");

    });

    it('Já existe o numero de serie para o dispositivo', async () => {
        
        let body = {
            "codigo": "as1",
            "descricaoDispositivo": "asdasdqwe123",
            "nickname": "ola",
            "tipoDispositivo": 1,
            "numeroSerie": "123456789"
        };


        let dispositivoRepoInstance = Container.get("DispositivoRepo");
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));
        sinon.stub(dispositivoRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        sinon.stub(dispositivoRepoInstance, "findByNickname").returns(Promise.resolve(null));
        sinon.stub(dispositivoRepoInstance, "findByNumeroSerie").returns(Promise.resolve([Container.get("dispositivo")]));

        const dispositivoService = new DispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo,dispositivoRepoInstance as IDispositivoRepo);
        const answer = await dispositivoService.adicionarDispositivoAFrota(body as IAdicionarRoboAFrotaDTO);
        expect(answer.errorValue()).to.equal("O dispositivo com o numero de serie 123456789 já existe");   

    });

    it('Criar o dispositivo com descrição preenchida', async () => {
        
        let body = {
            "codigo": "as1",
            "descricaoDispositivo": "asdasdqwe123",
            "nickname": "ola",
            "tipoDispositivo": 1,
            "numeroSerie": "123456789"
        };


        let dispositivoRepoInstance = Container.get("DispositivoRepo");
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));
        sinon.stub(dispositivoRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        sinon.stub(dispositivoRepoInstance, "findByNickname").returns(Promise.resolve(null));
        sinon.stub(dispositivoRepoInstance, "findByNumeroSerie").returns(Promise.resolve([]));
        sinon.stub(dispositivoRepoInstance, "save").returns(Promise.resolve(Container.get("dispositivo")));

        const dispositivoService = new DispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo,dispositivoRepoInstance as IDispositivoRepo);
        const answer = await dispositivoService.adicionarDispositivoAFrota(body as IAdicionarRoboAFrotaDTO);
        expect(answer.getValue().codigo).to.equal(body.codigo);
        expect(answer.getValue().descricaoDispositivo).to.equal(body.descricaoDispositivo);
        expect(answer.getValue().nickname).to.equal(body.nickname);
        expect(answer.getValue().numeroSerie).to.equal(body.numeroSerie);
        expect(answer.getValue().estado).to.equal(true);    

    });

    it('Criar o dispositivo com descrição vazia', async () => {
        
        let body = {
            "codigo": "as1",
            "nickname": "ola",
            "tipoDispositivo": 1,
            "numeroSerie": "123456789"
        };


        let dispositivoRepoInstance = Container.get("DispositivoRepo");
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));
        sinon.stub(dispositivoRepoInstance, "findByDomainId").returns(Promise.resolve(null));
        sinon.stub(dispositivoRepoInstance, "findByNickname").returns(Promise.resolve(null));
        sinon.stub(dispositivoRepoInstance, "findByNumeroSerie").returns(Promise.resolve([]));
        sinon.stub(dispositivoRepoInstance, "save").returns(Promise.resolve(Container.get("dispositivo")));

        const dispositivoService = new DispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo,dispositivoRepoInstance as IDispositivoRepo);
        const answer = await dispositivoService.adicionarDispositivoAFrota(body as IAdicionarRoboAFrotaDTO);
        expect(answer.getValue().codigo).to.equal(body.codigo);
        expect(answer.getValue().nickname).to.equal(body.nickname);
        expect(answer.getValue().numeroSerie).to.equal(body.numeroSerie);
        expect(answer.getValue().estado).to.equal(true);    

    });

    it('DispositivoService + DispositivoRepo + TipoDispositivoRepo teste de integração', async () => {
        
        let body = {
            "codigo": "as1",
            "descricaoDispositivo": "asdasdqwe123",
            "nickname": "ola",
            "tipoDispositivo": 1,
            "numeroSerie": "123456789"
        };

        const tipoDispositivoPersistence = {
            idTipoDispositivo : 1,
            tipoTarefa : ["Vigilancia"],
            marca : "as1",
            modelo : "as1",
        } as ITipoDispositivoPersistence;

        const dispositivoPersistence = {
            codigo: "as1",
            descricaoDispositivo: "asdasdqwe123",
            estado: true,
            nickname: "ola",
            numeroSerie: "123456789",
            tipoDeDispositivo: 1,
        } as IDispositivoPersistence;


        let dispositivoSchemaInstance = Container.get("DispositivoSchema");
        let tipoDispositivoSchemaInstance = Container.get("TipoDispositivo");
        
        sinon.stub(tipoDispositivoSchemaInstance, "findOne").returns(tipoDispositivoPersistence);

        sinon.stub(dispositivoSchemaInstance, "findOne").returns(Promise.resolve(null));
        sinon.stub(dispositivoSchemaInstance, "find").returns([]);
        sinon.stub(dispositivoSchemaInstance, "create").returns(Promise.resolve(dispositivoPersistence as IDispositivoPersistence));

        const dispositivoService = new DispositivoService(new TipoDispositivoRepo(tipoDispositivoSchemaInstance as any),new DispositivoRepo(dispositivoSchemaInstance as any));
        const answer = await dispositivoService.adicionarDispositivoAFrota(body as IAdicionarRoboAFrotaDTO);
        expect(answer.getValue().codigo).to.equal(body.codigo);
        expect(answer.getValue().descricaoDispositivo).to.equal(body.descricaoDispositivo);
        expect(answer.getValue().nickname).to.equal(body.nickname);
        expect(answer.getValue().numeroSerie).to.equal(body.numeroSerie);
        expect(answer.getValue().estado).to.equal(true);    

    });

    it('Listar dispositivos da frota dá erro quando não exitem dispositivos', async () => {
        
        let dispositivoRepoInstance = Container.get("DispositivoRepo");
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");
        sinon.stub(dispositivoRepoInstance, "findAll").returns(Promise.resolve([]));

        const dispositivoService = new DispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo,dispositivoRepoInstance as IDispositivoRepo);
        const answer = await dispositivoService.listarDispositivosDaFrota();
        expect(answer.errorValue()).to.equal('Não existem dispositivos na frota');

    });

    it('Listar dispositivos da frota tem sucesso', async () => {
        
        let dispositivoRepoInstance = Container.get("DispositivoRepo");
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");

        let dispositivos : Dispositivo[] = [];
        dispositivos.push(Container.get("dispositivo"));

        sinon.stub(dispositivoRepoInstance, "findAll").returns(Promise.resolve(dispositivos));



        const dispositivoService = new DispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo,dispositivoRepoInstance as IDispositivoRepo);
        const answer = (await dispositivoService.listarDispositivosDaFrota()).getValue();

        expect(answer[0].codigo).to.equal('as1');
        expect(answer[0].descricaoDispositivo).to.equal('asdasdqwe123');
        expect(answer[0].nickname).to.equal('ola');
        expect(answer[0].numeroSerie).to.equal('123456789');
        expect(answer[0].estado).to.equal(true);        
    });

    it('(Listar dispositiovos da frota) DispositivoService + DispositivoRepo teste de integração', async () => {
        
        const dispositivoPersistence = {
            codigo: "as1",
            descricaoDispositivo: "asdasdqwe123",
            estado: true,
            nickname: "ola",
            numeroSerie: "123456789",
            tipoDeDispositivo: 1,
        } as IDispositivoPersistence;


        let dispositivoSchemaInstance = Container.get("DispositivoSchema");
        let tipoDispositivoSchemaInstance = Container.get("TipoDispositivo");
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");

        sinon.stub(dispositivoSchemaInstance, "find").returns(Promise.resolve([dispositivoPersistence as IDispositivoPersistence]));
        
        sinon.stub(tipoDispositivoRepoInstance, "findByDomainId").returns( Promise.resolve(Container.get("tipoDispositivo")));

        const dispositivoService = new DispositivoService(new TipoDispositivoRepo(tipoDispositivoSchemaInstance as any),new DispositivoRepo(dispositivoSchemaInstance as any));
        
        const answer = (await dispositivoService.listarDispositivosDaFrota()).getValue();

        expect(answer[0].codigo).to.equal('as1');
        expect(answer[0].descricaoDispositivo).to.equal('asdasdqwe123');
        expect(answer[0].nickname).to.equal('ola');
        expect(answer[0].numeroSerie).to.equal('123456789');
        expect(answer[0].estado).to.equal(true);       

    });

    it('Listar codigo dos dispositivos da frota por tarefa tem sucesso', async () => {
        
        let dispositivoRepoInstance = Container.get("DispositivoRepo");
        let tipoDispositivoRepoInstance = Container.get("TipoDispositivoRepo");

        let dispositivos : Dispositivo[] = [];
        dispositivos.push(Container.get("dispositivo"));

        let tipoDispositivoProps : any = {
            tipoTarefa: [TipoTarefa.create('PickUp/Delivery').getValue()],
            marca: Marca.create('Marca').getValue(),
            modelo: Modelo.create('Modelo').getValue(),
        }
        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps,IdTipoDispositivo.create(2).getValue()).getValue();

        let dispositivoProps : any = {
            descricaoDispositivo: DescricaoDispositivo.create("asdasdqwe123").getValue(),
            estado: EstadoDispositivo.create(true).getValue(),
            nickname: Nickname.create("ola").getValue(),
            numeroSerie: NumeroDeSerie.create("123456789").getValue(),
            tipoDeDispositivo: tipoDispositivo,
        };

        const dispositivo = Dispositivo.create(dispositivoProps,CodigoDispositivo.create("as2").getValue()).getValue();

        dispositivos.push(dispositivo);
        sinon.stub(dispositivoRepoInstance, "findAll").returns(Promise.resolve(dispositivos));



        const dispositivoService = new DispositivoService(tipoDispositivoRepoInstance as ITipoDispositivoRepo,dispositivoRepoInstance as IDispositivoRepo);
        const answer = (await dispositivoService.listarCodigoDosDispositivosDaFrotaPorTarefa()).getValue();
        expect(answer.dispositivosVigilancia[0]).to.equal('as1');
        expect(answer.dispositivosPickup[0]).to.equal('as2');       
    });
});
