import {expect} from 'chai';
import {it} from 'mocha';
import { TipoTarefa } from '../../../src/domain/tipoDispositivo/TipoTarefa';

describe('teste do Tipo de Tarefa de um tipo de Dispositivo', () => {
    //Valores válidos para Tipo de Tarefa um tipo de Dispositivo
    let tipoTarefa1 = 'Vigilancia';
    let tipoTarefa2 = 'PickUp/Delivery';

    //Valores inválidos para Tipo de Tarefa de um tipo de Dispositivo
    let tipoTarefaInvalido1 = 'Vigil';

    //Testes de Tipo de Tarefa Válidos

    it('criação de um tipo de tarefa vigilância', () => {
        const resultado = TipoTarefa.create(tipoTarefa1);
        expect(true).to.equal(resultado.isSuccess);
    });
    it('criação de um tipo de tarefa pickup/delivery', () => {
        const resultado = TipoTarefa.create(tipoTarefa2);
        expect(true).to.equal(resultado.isSuccess);
    });

    //Testes de Tipo de Tarefa Inválidos

    it('criação de um tipo de tarefa não válido', () => {
        const resultado = TipoTarefa.create(tipoTarefaInvalido1);
        expect(false).to.equal(resultado.isSuccess);
    });
});