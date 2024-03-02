import 'reflect-metadata';
import * as assert from 'assert';
import {expect} from 'chai';
import { DescricaoElevador } from '../../../src/domain/elevador/DescricaoElevador';
import { ModeloElevador } from '../../../src/domain/elevador/ModeloElevador';
import { MarcaElevador } from '../../../src/domain/elevador/MarcaElevador';
import {NumeroSerieElevador } from '../../../src/domain/elevador/NumeroSerieElevador';
import { Ponto } from '../../../src/domain/ponto/Ponto';
import { DescricaoPiso } from '../../../src/domain/piso/DescricaoPiso';
import { IdPiso } from '../../../src/domain/piso/IdPiso';
import { NumeroPiso } from '../../../src/domain/piso/NumeroPiso';
import { Piso } from '../../../src/domain/piso/Piso';
import {Elevador} from '../../../src/domain/elevador/Elevador'
import { IdElevador } from '../../../src/domain/elevador/IdElevador';



describe('Elevador domain', function () {

	it('Elevador é criado com sucesso', async function () {
		let idElevador = IdElevador.create(1).getValue();
        let marcaElevador = MarcaElevador.create('123').getValue();
        let modeloElevador = ModeloElevador.create('123').getValue();
        let numeroSerieElevador = NumeroSerieElevador.create('123').getValue();
        let descricaoElevador = DescricaoElevador.create('123').getValue();
		
        // Criar 2 pisos
        let pisosServidos: Piso[]=[];

        for (let i = 1; i<= 2 ; i++){
            let descricaoPiso = DescricaoPiso.create("Piso"+i).getValue();
            let idPiso = IdPiso.create(i).getValue();
            let numeroPiso = NumeroPiso.create(i).getValue();
            let mapa;

            pisosServidos.push(await Piso.create({
                numeroPiso: numeroPiso,
                descricaoPiso: descricaoPiso,
                mapa: mapa,
            }, idPiso).getValue())
        }

        let elevadorOrError = await Elevador.create({
            pisosServidos: pisosServidos,
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, idElevador)

		assert.strictEqual(elevadorOrError.isSuccess, true);
	});
    
    it('Elevador não é criado com menos de 2 pisos', async function () {
		let idElevador = IdElevador.create(1).getValue();
        let marcaElevador = MarcaElevador.create('123').getValue();
        let modeloElevador = ModeloElevador.create('123').getValue();
        let numeroSerieElevador = NumeroSerieElevador.create('123').getValue();
        let descricaoElevador = DescricaoElevador.create('123').getValue();
		let pontos: Ponto[] = [];
        //Criar array de pontos vazios
       
        
        // Criar 1 pisos
        let pisosServidos: Piso[]=[];

        for (let i = 1; i<= 1 ; i++){
            let descricaoPiso = DescricaoPiso.create("Piso"+i).getValue();
            let idPiso = IdPiso.create(i).getValue();
            let numeroPiso = NumeroPiso.create(i).getValue();
            let mapa;

            pisosServidos.push(await Piso.create({
                numeroPiso: numeroPiso,
                descricaoPiso: descricaoPiso,
                mapa: mapa,
            }, idPiso).getValue())
        }

        let elevadorOrError = await Elevador.create({
            pisosServidos: pisosServidos,
            marca: marcaElevador,
            modelo: modeloElevador,
            numeroSerie: numeroSerieElevador,
            descricao: descricaoElevador
        }, idElevador)

		assert.strictEqual(elevadorOrError.isFailure, true);
	});
});