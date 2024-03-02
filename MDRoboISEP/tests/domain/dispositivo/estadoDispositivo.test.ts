import {expect} from 'chai';
import {it} from 'mocha';
import { EstadoDispositivo} from '../../../src/domain/dispositivo/EstadoDispositivo';

describe('Estado Dispositivo', () => {
    

    it('Criação de um estado tem sucesso', () => {
    const descricaoDispositivo = EstadoDispositivo.create(true);
    expect(true).to.equal(descricaoDispositivo.isSuccess);
    });

    it('Criação de estado do dispositivo com valores undefined falha', () => {
        let estadoErro;
        const descricaoDispositivo2 = EstadoDispositivo.create(estadoErro);
        expect(true).to.equal(descricaoDispositivo2.isFailure);
    });

});