import { Edificio } from '../../../src/domain/edificio/Edificio';
import {it} from 'mocha';

import {expect} from 'chai';
import { Dispositivo } from '../../../src/domain/dispositivo/Dispositivo';
import { CodigoDispositivo } from '../../../src/domain/dispositivo/CodigoDispositivo'
import { DescricaoDispositivo } from '../../../src/domain/dispositivo/DescricaoDispositivo';
import { EstadoDispositivo } from '../../../src/domain/dispositivo/EstadoDispositivo';
import { Nickname } from '../../../src/domain/dispositivo/Nickname';
import { NumeroDeSerie } from '../../../src/domain/dispositivo/NumeroDeSerie';
import { TipoDispositivo } from '../../../src/domain/tipoDispositivo/TipoDispositivo';
import { Marca } from '../../../src/domain/tipoDispositivo/Marca';
import { Modelo } from '../../../src/domain/tipoDispositivo/Modelo';
import { IdTipoDispositivo } from '../../../src/domain/tipoDispositivo/IdTipoDispositivo';
import { TipoTarefa } from '../../../src/domain/tipoDispositivo/TipoTarefa';

describe('Dispositivo', () => {

    it('Criação de dispositivo válido com atributos não essenciais', () => {
        
        let tipoDispositivoProps : any = {
            tipoTarefa: [TipoTarefa.create('Vigilancia').getValue()],
            marca: Marca.create('Marca').getValue(),
            modelo: Modelo.create('Modelo').getValue(),
        }
        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps,IdTipoDispositivo.create(1).getValue());
        
        let dispositivoProps : any = {
            descricaoDispositivo: DescricaoDispositivo.create('Luz').getValue(),
            estado: EstadoDispositivo.create(true).getValue(),
            nickname: Nickname.create('Luz').getValue(),
            numeroSerie: NumeroDeSerie.create('123456789').getValue(),
            tipoDeDispositivo: tipoDispositivo.getValue(),
        };
        const dispositivo = Dispositivo.create(dispositivoProps,CodigoDispositivo.create("ASas").getValue());
        expect(true).to.equal(dispositivo.isSuccess);
    });

    it('Criação de dispositivo válido com atributos não essenciais', () => {
        
        let tipoDispositivoProps : any = {
            tipoTarefa: [TipoTarefa.create('Vigilancia').getValue()],
            marca: Marca.create('Marca').getValue(),
            modelo: Modelo.create('Modelo').getValue(),
        }
        const tipoDispositivo = TipoDispositivo.create(tipoDispositivoProps,IdTipoDispositivo.create(1).getValue());
        
        let dispositivoProps : any = {
            estado: EstadoDispositivo.create(true).getValue(),
            nickname: Nickname.create('Luz').getValue(),
            numeroSerie: NumeroDeSerie.create('123456789').getValue(),
            tipoDeDispositivo: tipoDispositivo.getValue(),
        };
        const dispositivo = Dispositivo.create(dispositivoProps,CodigoDispositivo.create("ASas").getValue());
        expect(true).to.equal(dispositivo.isSuccess);
    });
    

});