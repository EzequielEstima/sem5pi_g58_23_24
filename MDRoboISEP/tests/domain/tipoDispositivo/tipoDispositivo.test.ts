import { TipoDispositivo } from '../../../src/domain/tipoDispositivo/TipoDispositivo'
import {it} from 'mocha';

import {expect} from 'chai';
import { IdTipoDispositivo } from '../../../src/domain/tipoDispositivo/IdTipoDispositivo'
import { TipoTarefa } from '../../../src/domain/tipoDispositivo/TipoTarefa'
import {Marca} from '../../../src/domain/tipoDispositivo/Marca'
import {Modelo} from '../../../src/domain/tipoDispositivo/Modelo'

describe('teste de Tipo de Dispositivo', () => {
    //Valores válidos para criação de um Tipo de Dispositivo
    let idTipoDispositivo = IdTipoDispositivo.create(1);
    let tipoTarefa = TipoTarefa.create('Vigilancia');
    let listaTipoTarefa = [tipoTarefa.getValue()];
    let marca = Marca.create('Marca').getValue();
    let modelo = Modelo.create('Modelo').getValue();

    it('Criação de Tipo de Dispositivo', () => {
        let tipoDispositivoProps : any = {
            tipoTarefa: listaTipoTarefa,
            marca: marca,
            modelo: modelo,
        }
        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps,idTipoDispositivo.getValue());
        expect(true).to.equal(tipoDispositivo.isSuccess);
    });

    it('Criação de Tipo de Dispositivo com tipo de tarefa a Null', () => {
        let tipoDispositivoProps : any = {
            tipoTarefa: null,
            marca: marca,
            modelo: modelo,
        };
        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps,idTipoDispositivo.getValue());
        expect(false).to.equal(tipoDispositivo.isSuccess);
    });
    it('Criação de Tipo de Dispositivo com tipo de tarefa Undefined', () => {
        let tipoDispositivoProps : any = {
            tipoTarefa: undefined,
            marca: marca,
            modelo: modelo,
        };
        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps,idTipoDispositivo.getValue());
        expect(false).to.equal(tipoDispositivo.isSuccess);
    });
    it('Criação de Tipo de Dispositivo com Marca a Null', () => {
        let tipoDispositivoProps : any = {
            tipoTarefa: listaTipoTarefa,
            marca: null,
            modelo: modelo,
        };
        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps,idTipoDispositivo.getValue());
        expect(false).to.equal(tipoDispositivo.isSuccess);
    });
    it('Criação de Tipo de Dispositivo com Marca Undefined', () => {
        let tipoDispositivoProps : any = {
            tipoTarefa: listaTipoTarefa,
            marca: undefined,
            modelo: modelo,
        };
        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps,idTipoDispositivo.getValue());
        expect(false).to.equal(tipoDispositivo.isSuccess);
    });
    it('Criação de Tipo de Dispositivo com Modelo a Null', () => {
        let tipoDispositivoProps : any = {
            tipoTarefa: listaTipoTarefa,
            marca: marca,
            modelo: null,
        };
        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps,idTipoDispositivo.getValue());
        expect(false).to.equal(tipoDispositivo.isSuccess);
    });
    it('Criação de Tipo de Dispositivo com Modelo Undefined', () => {
        let tipoDispositivoProps : any = {
            tipoTarefa: listaTipoTarefa,
            marca: marca,
            modelo: undefined,
        };
        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps,idTipoDispositivo.getValue());
        expect(false).to.equal(tipoDispositivo.isSuccess);
    });
});