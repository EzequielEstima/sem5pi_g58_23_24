import { NumeroSerieElevador } from '../../../src/domain/elevador/NumeroSerieElevador'
import * as assert from 'assert';

describe('NumeroSerieElevador', function(){

    it('NumeroSerieElevador não é criado com mais de 50 caracteres', async function () {
        let numeroSerieElevador = NumeroSerieElevador.create('12345678901234567890'
        + '1234567890123456789012345678901');
        assert.strictEqual(numeroSerieElevador.isFailure, true);
    });

    it('NumeroSerieElevador é criado com 50 caracteres', async function () {
        let numeroSerieElevador = NumeroSerieElevador.create('12345678901234567890'
        + '123456789012345678901234567890');
        assert.strictEqual(numeroSerieElevador.isSuccess, true);
    });

    it('NumeroSerieElevador é criado com menos de 50 caracteres', async function () {
        let numeroSerieElevador = NumeroSerieElevador.create('12345678901234567890');
        assert.strictEqual(numeroSerieElevador.isSuccess, true);
    });

    it('NumeroSerieElevador não é criado com carateres não alfanumericos', async function () {
        let numeroSerieElevador = NumeroSerieElevador.create('12345678901234567890%%');
        assert.strictEqual(numeroSerieElevador.isFailure, true);
    });

    it('NumeroSerieElevador é criado com string nula (é opcional)', async function () {
        let numeroSerieElevador = NumeroSerieElevador.create(null);
        assert.strictEqual(numeroSerieElevador.isSuccess, true);
    });

});