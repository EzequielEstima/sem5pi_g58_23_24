import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import { Coordenadas } from '../../../src/domain/ponto/Coordenadas'
import * as assert from 'assert';


describe('Coordenadas domain', function () {

	it('Coordenadas é criado com numeros positivos', async function () {
		// Arrange
		let coordenadas = Coordenadas.create({abscissa: 2, ordenada: 1});
		assert.strictEqual(coordenadas.isSuccess, true);
	});

    it('Coordenadas é criado com abscissa igual a 0', async function () {
		// Arrange
		let coordenadas = Coordenadas.create({abscissa: 0, ordenada: 1});
		assert.strictEqual(coordenadas.isSuccess, true);
	});

    it('Coordenadas é criado com ordenada igual a 0', async function () {
		// Arrange
		let coordenadas = Coordenadas.create({abscissa: 1, ordenada: 0});
		assert.strictEqual(coordenadas.isSuccess, true);
	});

    it('Coordenadas não é possivel criar com abscissa negativa', async function () {
		// Arrange
		let coordenadas = Coordenadas.create({abscissa: -2, ordenada: 1});
		assert.strictEqual(coordenadas.isFailure, true);
	});
    
    it('Coordenadas não é possivel criar com ordenada negativa', async function () {
		// Arrange
		let coordenadas = Coordenadas.create({abscissa: 1, ordenada: -1});
		assert.strictEqual(coordenadas.isFailure, true);
	});

    it('Coordenadas não é possivel criar com valores negativos', async function () {
		// Arrange
		let coordenadas = Coordenadas.create({abscissa: -1, ordenada: -1});
		assert.strictEqual(coordenadas.isFailure, true);
	});

	it('Coordenadas não é possivel criar com abscissa undefined', async function () {
		// Arrange
		let abscissa;
		let coordenadas = Coordenadas.create({abscissa: abscissa, ordenada: 1});
		assert.strictEqual(coordenadas.isFailure, true);
	});

	it('Coordenadas não é possivel criar com ordenada undefined', async function () {
		// Arrange
		let ordenada;
		let coordenadas = Coordenadas.create({abscissa: 1, ordenada: ordenada});
		assert.strictEqual(coordenadas.isFailure, true);
	});

	it('Coordenadas não é possivel criar com undefined', async function () {
		// Arrange
		let abscissa;
		let ordenada;
		let coordenadas = Coordenadas.create({abscissa: abscissa, ordenada: ordenada});
		assert.strictEqual(coordenadas.isFailure, true);
	});

	it('Coordenadas não é possivel criar com abscissa null', async function () {
		// Arrange
		let coordenadas = Coordenadas.create({abscissa: null, ordenada: 1});
		assert.strictEqual(coordenadas.isFailure, true);
	});

	it('Coordenadas não é possivel criar com ordenada null', async function () {
		// Arrange
		let coordenadas = Coordenadas.create({abscissa: 1, ordenada: null});
		assert.strictEqual(coordenadas.isFailure, true);
	});

	it('Coordenadas não é possivel criar com null', async function () {
		// Arrange
		let coordenadas = Coordenadas.create({abscissa: null, ordenada: null});
		assert.strictEqual(coordenadas.isFailure, true);
	});

});