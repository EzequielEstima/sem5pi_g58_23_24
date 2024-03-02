
import 'reflect-metadata';

import * as assert from 'assert';
import DescricaoSala from '../../../src/domain/sala/DescricaoSala';

describe('Descricao Sala domain', function () {

    it('categoria da sala é criado com sucesso - Gabinete', async function () {
        let descricaoOrError = DescricaoSala.create("Sala B300 - Laboratorio de Informatica:");
        assert.equal(descricaoOrError.isSuccess, true);
    });

    it('descricao da sala não é criado com uma descricao com mais de 250 carateres', async function () {
        let descricaoOrError = DescricaoSala.create("Sala B300 - Laboratorio de Informatica:"+
            "Uma sala de aula moderna, configurada como um laboratório de informática, equipada com computadores de última geração,"+
            "quadro interativo e assentos ergonómicos dispostos metodicamente para otimizar o aprendizado!");
        assert.equal(descricaoOrError.errorValue(), null);
    });

});