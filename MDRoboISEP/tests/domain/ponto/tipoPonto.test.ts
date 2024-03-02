import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import {TipoPonto} from '../../../src/domain/ponto/TipoPonto'
import * as assert from 'assert';


describe('TipoPonto domain', function () {

	it('TipoPonto é criado com uma string vazia', async function () {
		// Arrange
		let tipoPonto = TipoPonto.create(" ");
		assert.strictEqual(tipoPonto.isSuccess, true);
	});

    it('TipoPonto é criado com uma string "Norte"', async function () {
		// Arrange
		let tipoPonto = TipoPonto.create("Norte");
		assert.strictEqual(tipoPonto.isSuccess, true);
	});

    it('TipoPonto é criado com uma string "Elevador"', async function () {
		// Arrange
		let tipoPonto = TipoPonto.create("Elevador");
		assert.strictEqual(tipoPonto.isSuccess, true);
	});


    it('TipoPonto é criado com uma string "Oeste"', async function () {
		// Arrange
		let tipoPonto = TipoPonto.create("Oeste");
		assert.strictEqual(tipoPonto.isSuccess, true);
	});

    it('TipoPonto é criado com uma string "NorteOeste"', async function () {
		// Arrange
		let tipoPonto = TipoPonto.create("NorteOeste");
		assert.strictEqual(tipoPonto.isSuccess, true);
	});

    it('TipoPonto é criado com uma string "PortaNorte"', async function () {
		// Arrange
		let tipoPonto = TipoPonto.create("PortaNorte");
		assert.strictEqual(tipoPonto.isSuccess, true);
	});

    it('TipoPonto é criado com uma string "PortaOeste"', async function () {
		// Arrange
		let tipoPonto = TipoPonto.create("PortaOeste");
		assert.strictEqual(tipoPonto.isSuccess, true);
	});

    it('TipoPonto é criado com uma string "PortaNorteOeste"', async function () {
		// Arrange
		let tipoPonto = TipoPonto.create("PortaNorteOeste");
		assert.strictEqual(tipoPonto.isSuccess, true);
	});


    it('TipoPonto não é criado com uma string "ola"', async function () {
		// Arrange
		let tipoPonto = TipoPonto.create("ola");
		assert.strictEqual(tipoPonto.isFailure, true);
	});

	it('TipoPonto não é criado com undefined', async function () {
		// Arrange
		let string;
		let tipoPonto = TipoPonto.create(string);
		assert.strictEqual(tipoPonto.isFailure, true);
	});

	it('TipoPonto não é criado com null', async function () {
		// Arrange
		let tipoPonto = TipoPonto.create(null);
		assert.strictEqual(tipoPonto.isFailure, true);
	});

});
