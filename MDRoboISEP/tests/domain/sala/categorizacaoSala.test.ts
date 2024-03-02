import 'reflect-metadata';

import * as assert from 'assert';
import CategorizacaoSala from '../../../src/domain/sala/CategorizacaoSala';

describe('categorizacao domain', function () {

    it('categoria da sala é criado com sucesso - Laboratorio', async function () {
        let categoriaOrError = CategorizacaoSala.create("Laboratorio");
        assert.equal(categoriaOrError.isSuccess, true);
    });

    it('categoria da sala é criado com sucesso - Gabinete', async function () {
        let categoriaOrError = CategorizacaoSala.create("Gabinete");
        assert.equal(categoriaOrError.isSuccess, true);
    });

    it('categoria da sala é criado com sucesso - Anfiteatro', async function () {
        let categoriaOrError = CategorizacaoSala.create("Anfiteatro");
        assert.equal(categoriaOrError.isSuccess, true);
    });

    it('categoria da sala é criado com sucesso - Outro', async function () {
        let categoriaOrError = CategorizacaoSala.create("Outro");
        assert.equal(categoriaOrError.isSuccess, true);
    });

    it('categoria da sala não é criado com qualquer categoria', async function () {
        let categoriaOrError = CategorizacaoSala.create("Im a Teapot");
        assert.equal(categoriaOrError.errorValue(), "categorizacao isn't oneOf the correct types in "+
        "[\"Gabinete\",\"Anfiteatro\",\"Laboratorio\",\"Outro\"]. Got \"Im a Teapot\".");
    });

});