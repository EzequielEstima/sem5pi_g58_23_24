import {expect} from 'chai';
import {it} from 'mocha';
import { IdTipoDispositivo } from '../../../src/domain/tipoDispositivo/IdTipoDispositivo';

describe('teste do ID do Tipo de Dispositivo', () => {
    //Valores válidos para ID do Tipo de Dispositivo
    let idTipoDispositivo = 1;

    //Valores inválidos para Tipo de Tarefa de um tipo de Dispositivo
    let idTipoDispositivoInvalido1;
    let idTipoDispositivoInvalido2 = 0;
    let idTipoDispositivoInvalido3 = -1;


    //Testes de Tipo de Tarefa Válidos

    it('criação de um id de tipo de dispositivo válido', () => {
        const resultado = IdTipoDispositivo.create(idTipoDispositivo);
        expect(true).to.equal(resultado.isSuccess);
    });

    //Testes de Tipo de Tarefa Inválidos

    it('criação de um id de tipo dispositivo not initialized', () => {
        const resultado = IdTipoDispositivo.create(idTipoDispositivoInvalido1);
        expect(false).to.equal(resultado.isSuccess);
    });

    it('criação de um id de tipo dispositivo 0', () => {
        const resultado = IdTipoDispositivo.create(idTipoDispositivoInvalido2);
        expect(false).to.equal(resultado.isSuccess);
    });
    it('criação de um id de tipo dispositivo negativo', () => {
        const resultado = IdTipoDispositivo.create(idTipoDispositivoInvalido3);
        expect(false).to.equal(resultado.isSuccess);
    });
});