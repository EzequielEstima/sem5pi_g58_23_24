import { ModeloElevador } from '../../../src/domain/elevador/ModeloElevador'
import * as assert from 'assert';

describe('ModeloElevador', function(){

    it('ModeloElevador não é criado com mais de 50 caracteres', async function () {
        let modeloElevador = ModeloElevador.create('12345678901234567890'
        + '1234567890123456789012345678901');
        assert.strictEqual(modeloElevador.isFailure, true);
    });

    it('ModeloElevador é criado com 50 caracteres', async function () {
        let modeloElevador = ModeloElevador.create('12345678901234567890'
        + '123456789012345678901234567890');
        assert.strictEqual(modeloElevador.isSuccess, true);
    });

    it('ModeloElevador é criado com menos de 50 caracteres', async function () {
        let modeloElevador = ModeloElevador.create('12345678901234567890');
        assert.strictEqual(modeloElevador.isSuccess, true);
    });

    it('ModeloElevador não é criado com carateres não alfanumericos', async function () {
        let modeloElevador = ModeloElevador.create('12345678901234567890%%');
        assert.strictEqual(modeloElevador.isFailure, true);
    });

    it('ModeloElevador é criado com string nula (é opcional)', async function () {
        let modeloElevador = ModeloElevador.create(null);
        assert.strictEqual(modeloElevador.isSuccess, true);
    });

});