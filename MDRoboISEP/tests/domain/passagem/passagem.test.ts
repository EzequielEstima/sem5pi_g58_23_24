import 'reflect-metadata';

import { Passagem } from '../../../src/domain/passagem/Passagem'
import { IdPassagem } from '../../../src/domain/passagem/IdPassagem'
import * as assert from 'assert';
import { DescricaoPiso } from '../../../src/domain/piso/DescricaoPiso';
import { IdPiso } from '../../../src/domain/piso/IdPiso';
import { NumeroPiso } from '../../../src/domain/piso/NumeroPiso';
import { Piso } from '../../../src/domain/piso/Piso';

describe('passagem domain', function () {

	it('passagem é criado com sucesso', async function () {
		let idPassagem = IdPassagem.create(1).getValue();
	
		let mapa;
		let pisoA = Piso.create(
			{
				numeroPiso: NumeroPiso.create(0).getValue(),
				descricaoPiso: DescricaoPiso.create("Ola").getValue(), mapa: mapa
			},
			IdPiso.create(1).getValue()
		).getValue();

		let pisoB = Piso.create(
			{
				numeroPiso: NumeroPiso.create(0).getValue(),
				descricaoPiso: DescricaoPiso.create("Ola").getValue(), mapa: mapa
			},
			IdPiso.create(2).getValue()
		).getValue();

		let passagemOuErro = Passagem.create({
			pisoA: pisoA,
			pisoB: pisoB,
		}, idPassagem);

		assert.equal(passagemOuErro.isSuccess, true);
	});

	it('passagem não é criado com pisoA undefined', async function () {
		let idPassagem = IdPassagem.create(1).getValue();

		let mapa;
		let pisoB = Piso.create(
			{
				numeroPiso: NumeroPiso.create(0).getValue(),
				descricaoPiso: DescricaoPiso.create("Ola").getValue(), mapa: mapa
			},
			IdPiso.create(2).getValue()
		).getValue();

		let pisoA : Piso;

		let passagemOuErro = Passagem.create({
			pisoA: pisoA,
			pisoB: pisoB,
		}, idPassagem);

		assert.equal(passagemOuErro.errorValue(), "pisoA is null or undefined");
	} 
	
	);

	it('passagem não é criado com pisoA undefined', async function () {
		let idPassagem = IdPassagem.create(1).getValue();

		let mapa;
		let pisoA = Piso.create(
			{
				numeroPiso: NumeroPiso.create(0).getValue(),
				descricaoPiso: DescricaoPiso.create("Ola").getValue(), mapa: mapa
			},
			IdPiso.create(2).getValue()
		).getValue();

		let pisoB : Piso;

		let passagemOuErro = Passagem.create({
			pisoA: pisoA,
			pisoB: pisoB,
		}, idPassagem);

		assert.equal(passagemOuErro.errorValue(), "pisoB is null or undefined");
	}

	);

});