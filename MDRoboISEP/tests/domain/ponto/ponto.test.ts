import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import {Piso} from '../../../src/domain/piso/Piso'

import {Ponto} from '../../../src/domain/ponto/Ponto'
import { Coordenadas } from '../../../src/domain/ponto/Coordenadas';
import { TipoPonto } from '../../../src/domain/ponto/TipoPonto';
import { IdPonto } from '../../../src/domain/ponto/IdPonto';
import * as assert from 'assert';


describe('ponto domain', function () {

	it('ponto é criado com sucesso', async function () {
		// Arrange
		let idPonto = IdPonto.create(1).getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas:coordenadas,tipoPonto:tipoPonto},idPonto);

		assert.strictEqual(ponto.isSuccess, true);
	});

	it('ponto não é criado sem tipoPonto', async function () {
		// Arrange
		let idPonto = IdPonto.create(1).getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas:coordenadas,tipoPonto:null},idPonto);

		assert.strictEqual(ponto.isFailure, true);
	});

	it('ponto não é criado sem coordenadas', async function () {
		// Arrange
		let idPonto = IdPonto.create(1).getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas:null,tipoPonto:tipoPonto},idPonto);

		assert.strictEqual(ponto.isFailure, true);
	});

	it('toElevador muda o tipo de ponto para o tipo "Elevador"', async function () {
		// Arrange
		let idPonto = IdPonto.create(1).getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas:coordenadas,tipoPonto:tipoPonto},idPonto).getValue();

		ponto.toElevador();

		assert.strictEqual(ponto.returnTipoPonto(), "Elevador");
	});

	it('toNorteOeste muda o tipo de ponto para o tipo "NorteOeste"', async function () {
		// Arrange
		let idPonto = IdPonto.create(1).getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas:coordenadas,tipoPonto:tipoPonto},idPonto).getValue();

		ponto.toParedeNorteOeste();

		assert.strictEqual(ponto.returnTipoPonto(), "NorteOeste");
	});

	it('toNorte muda o tipo de ponto para o tipo "Norte"', async function () {
		// Arrange
		let idPonto = IdPonto.create(1).getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas:coordenadas,tipoPonto:tipoPonto},idPonto).getValue();

		ponto.toParedeNorte();

		assert.strictEqual(ponto.returnTipoPonto(), "Norte");
	});

	it('toOeste muda o tipo de ponto para o tipo "Oeste"', async function () {
		// Arrange
		let idPonto = IdPonto.create(1).getValue();
		let tipoPonto = TipoPonto.create(" ").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas:coordenadas,tipoPonto:tipoPonto},idPonto).getValue();

		ponto.toParedeOeste();

		assert.strictEqual(ponto.returnTipoPonto(), "Oeste");
	});

	it('toVazio muda o tipo de ponto para o tipo "Vazio"', async function () {
		// Arrange
		let idPonto = IdPonto.create(1).getValue();
		let tipoPonto = TipoPonto.create("Norte").getValue();
		let coordenadas = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto = Ponto.create({coordenadas:coordenadas,tipoPonto:tipoPonto},idPonto).getValue();

		ponto.toVazio();

		assert.strictEqual(ponto.returnTipoPonto(), " ");
	});

});

