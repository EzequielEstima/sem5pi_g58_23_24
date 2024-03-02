import { expect } from 'chai';
import * as sinon from 'sinon';
import Container from 'typedi';
import TipoDispositivoRepo from '../../src/repos/TipoDispositivoRepo';
import { ITipoDispositivoPersistence } from '../../src/dataschema/ITipoDispositivoPersistence';
import { TipoDispositivoMap } from '../../src/mappers/TipoDispositivoMap';
describe('Tipo Dispositivo Repo', () => {
    const sandbox = sinon.createSandbox();
    beforeEach(() => {
        Container.reset();
        let tipoDispositivoSchemaInstance = require('../../src/persistence/schemas/TipoDispositivoSchema').default;
        Container.set("TipoDispositivoSchema", tipoDispositivoSchemaInstance);

    });

    afterEach(() => {
        sinon.restore();
        sandbox.restore();
    });

    it('Exists deve retornar true se o tipo de dispositivo existir', async () => {
        const tipoDispositivoDTO = {
            idTipoDispositivo : 1,
            tipoTarefa : ["Vigilancia"],
            marca : "as1",
            modelo : "as1",
        } as ITipoDispositivoPersistence

        const tipoDispositivoSchemaInstance = Container.get("TipoDispositivoSchema");

        sinon.stub(tipoDispositivoSchemaInstance, "findOne").returns(tipoDispositivoDTO as ITipoDispositivoPersistence);
        const tipoDispositivoRepo = new TipoDispositivoRepo(tipoDispositivoSchemaInstance as any);
        const answer = await tipoDispositivoRepo.exists(await TipoDispositivoMap.toDomain(tipoDispositivoDTO));
        expect(answer).to.be.true;
    });

    it('Save deve retornar tipo de dispositivo', async () => {
        const tipoDispositivoDTO = {
            idTipoDispositivo : 1,
            tipoTarefa : ["Vigilancia"],
            marca : "as1",
            modelo : "as1",
        } as ITipoDispositivoPersistence
        const tipoDispositivoSchemaInstance = Container.get("TipoDispositivoSchema");
        sinon.stub(tipoDispositivoSchemaInstance, "findOne").returns(null);
        sinon.stub(tipoDispositivoSchemaInstance, "create").returns(tipoDispositivoDTO as ITipoDispositivoPersistence);
        const tipoDispositivoRepo = new TipoDispositivoRepo(tipoDispositivoSchemaInstance as any);
        const tipoDispositivo = await TipoDispositivoMap.toDomain(tipoDispositivoDTO);
        const answer = await tipoDispositivoRepo.save(tipoDispositivo);
        expect(answer.id.toValue()).to.be.equal(tipoDispositivo.id.toValue());
        expect(answer.returnMarca()).to.be.equal(tipoDispositivo.returnMarca());
        expect(answer.returnModelo()).to.be.equal(tipoDispositivo.returnModelo());
        expect(answer.returnTipoTarefa()).to.deep.equal(tipoDispositivo.returnTipoTarefa());
    });

    it('Save deve retornar tipo dispositivo ao dar update', async () => {
        const tipoDispositivoDTO1 = {
            idTipoDispositivo : 1,
            tipoTarefa : ["Vigilancia"],
            marca : "as1",
            modelo : "as1",
            save() {return this;}
        } as ITipoDispositivoPersistence

        const tipoDispositivoDTO2 = {
            idTipoDispositivo : 1,
            tipoTarefa : ["Vigilancia"],
            marca : "as2",
            modelo : "as2",
        } as ITipoDispositivoPersistence
        const tipoDispositivoSchemaInstance = Container.get("TipoDispositivoSchema");
        sinon.stub(tipoDispositivoSchemaInstance, "findOne").returns(tipoDispositivoDTO1 as ITipoDispositivoPersistence);
        const tipoDispositivoRepo = new TipoDispositivoRepo(tipoDispositivoSchemaInstance as any);
        const tipoDispositivo = await TipoDispositivoMap.toDomain(tipoDispositivoDTO2);
        const answer = await tipoDispositivoRepo.save(tipoDispositivo);
        expect(answer.id.toValue()).to.be.equal(tipoDispositivo.id.toValue());
        expect(answer.returnMarca()).to.be.equal(tipoDispositivo.returnMarca());
        expect(answer.returnModelo()).to.be.equal(tipoDispositivo.returnModelo());
        expect(answer.returnTipoTarefa()).to.deep.equal(tipoDispositivo.returnTipoTarefa());
    });

    it('FindByDomainId deve retornar tipo dispositivo', async () => {
        const tipoDispositivoDTO = {
            idTipoDispositivo : 1,
            tipoTarefa : ["Vigilancia"],
            marca : "as1",
            modelo : "as1",
        } as ITipoDispositivoPersistence
        const tipoDispositivoSchemaInstance = Container.get("TipoDispositivoSchema");
        sinon.stub(tipoDispositivoSchemaInstance, "findOne").returns(tipoDispositivoDTO as ITipoDispositivoPersistence);
        const tipoDispositivoRepo = new TipoDispositivoRepo(tipoDispositivoSchemaInstance as any);
        const answer = await tipoDispositivoRepo.findByDomainId(tipoDispositivoDTO.idTipoDispositivo);
        expect(answer.id.toValue()).to.be.equal(tipoDispositivoDTO.idTipoDispositivo);
        expect(answer.returnMarca()).to.be.equal(tipoDispositivoDTO.marca);
        expect(answer.returnModelo()).to.be.equal(tipoDispositivoDTO.modelo);
        expect(answer.returnTipoTarefa()).to.deep.equal(tipoDispositivoDTO.tipoTarefa);
    });

    it('FindByDomainId deve retornar null se não encontrar nada', async () => {
        const tipoDispositivoDTO = {
            idTipoDispositivo : 1,
            tipoTarefa : ["Vigilancia"],
            marca : "as1",
            modelo : "as1",
        } as ITipoDispositivoPersistence
        const tipoDispositivoSchemaInstance = Container.get("TipoDispositivoSchema");
        sinon.stub(tipoDispositivoSchemaInstance, "findOne").returns(null);
        const tipoDispositivoRepo = new TipoDispositivoRepo(tipoDispositivoSchemaInstance as any);
        const answer = await tipoDispositivoRepo.findByDomainId(tipoDispositivoDTO.idTipoDispositivo);
        expect(answer).to.be.equal(null);
    });

    it('getMaxId se não encontrar nada deve retornar 0', async () => {
        const tipoDispositivoSchemaInstance = Container.get("TipoDispositivoSchema");
        sinon.stub(tipoDispositivoSchemaInstance, "find").returns(0);
        const tipoDispositivoRepo = new TipoDispositivoRepo(tipoDispositivoSchemaInstance as any);
        const answer = await tipoDispositivoRepo.getMaxId();
        expect(answer).to.be.equal(0);
    });

    it('get maxId deve retornar o id maximo', async () => {
        const tipoDispositivoDTO = {
            idTipoDispositivo : 1,
            tipoTarefa : ["Vigilancia"],
            marca : "as1",
            modelo : "as1",
        } as ITipoDispositivoPersistence

        const tipoDispositivoDTO2 = {
            idTipoDispositivo : 2,
            tipoTarefa : ["Vigilancia"],
            marca : "as2",
            modelo : "as2",
        } as ITipoDispositivoPersistence
        const tipoDispositivoSchemaInstance = Container.get("TipoDispositivoSchema");
        sinon.stub(tipoDispositivoSchemaInstance, "find").returns([tipoDispositivoDTO, tipoDispositivoDTO2]);
        const tipoDispositivoRepo = new TipoDispositivoRepo(tipoDispositivoSchemaInstance as any);
        const answer = await tipoDispositivoRepo.getMaxId();
        expect(answer).to.be.equal(2);
    });
});