import { DescricaoElevador } from '../../../src/domain/elevador/DescricaoElevador'
import * as assert from 'assert';

describe('DescricaoElevador', function(){

    it('DescricaoElevador não é criada com mais de 250 caracteres', async function () {
        let descricaoElevador = DescricaoElevador.create("qwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwer"
        + "qwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwer"
        + "qwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwer");
        assert.strictEqual(descricaoElevador.isFailure, true);
    });

    it('DescricaoElevador é criada com 250 caracteres', async function () {
        let descricaoElevador = DescricaoElevador.create("zkeQ6p2KQURi7Ggy04Tu7caEIMbpN70wNFD44dJQlT2CCzsYHsnjj8J5OTc5o5r9nAlKZJ2UOfSRGEIHb0Ldjj8kCeHv0bDiA6F2JdRtnIgXdqSo714Y9xMOoEGjyxrMQuEH1csTIOZO3r44cK8f8lklx5sg9uDE1Vua9o9EHnTaffC8zeATFjR7uBCB8xWPsuS9JARfqXl1Ve1V5iBe1UtRgn5psG7NGXeR53ZKRkofVXOmDMO0AsCmXg");
        assert.strictEqual(descricaoElevador.isSuccess, true);
    });

    it('DescricaoElevador é criada com menos de 250 caracteres', async function () {
        let descricaoElevador = DescricaoElevador.create('12345678901234567890');
        assert.strictEqual(descricaoElevador.isSuccess, true);
    });

    it('DescricaoElevador não é criada com carateres não alfanumericos', async function () {
        let descricaoElevador = DescricaoElevador.create('12345678901234567890%%');
        assert.strictEqual(descricaoElevador.isFailure, true);
    });

    it('DescricaoElevador é criada com string nula (é opcional)', async function () {
        let descricaoElevador = DescricaoElevador.create(null);
        assert.strictEqual(descricaoElevador.isSuccess, true);
    });

});