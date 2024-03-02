import { IdElevador } from '../../../src/domain/elevador/IdElevador'
import * as assert from 'assert';

describe('IdElevador', function(){

    it('IdElevador não é criado com valor negativo', async function () {
        let idElevador = IdElevador.create(-1);
        assert.strictEqual(idElevador.isFailure, true);
    });

    it('IdElevador não é criado com valor 0', async function () {
        let idElevador = IdElevador.create(0);
        assert.strictEqual(idElevador.isFailure, true);
    });

    it('IdElevador é criado com valor positivo', async function () {
        let idElevador = IdElevador.create(1);
        assert.strictEqual(idElevador.isSuccess, true);
    });
});