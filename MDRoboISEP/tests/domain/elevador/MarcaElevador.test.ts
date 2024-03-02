import { MarcaElevador } from '../../../src/domain/elevador/MarcaElevador'
import * as assert from 'assert';

describe('MarcaElevador', function(){

    it('MarcaElevador não é criada com mais de 50 caracteres', async function () {
        let marcaElevador = MarcaElevador.create('12345678901234567890'
        + '1234567890123456789012345678901');
        assert.strictEqual(marcaElevador.isFailure, true);
    });

    it('MarcaElevador é criada com 50 caracteres', async function () {
        let marcaElevador = MarcaElevador.create('12345678901234567890'
        + '123456789012345678901234567890');
        assert.strictEqual(marcaElevador.isSuccess, true);
    });

    it('MarcaElevador é criada com menos de 50 caracteres', async function () {
        let marcaElevador = MarcaElevador.create('12345678901234567890');
        assert.strictEqual(marcaElevador.isSuccess, true);
    });

    it('MarcaElevador não é criada com carateres não alfanumericos', async function () {
        let marcaElevador = MarcaElevador.create('12345678901234567890%%');
        assert.strictEqual(marcaElevador.isFailure, true);
    });

    it('MarcaElevador é criada com string nula (é opcional)', async function () {
        let marcaElevador = MarcaElevador.create(null);
        assert.strictEqual(marcaElevador.isSuccess, true);
    });

});