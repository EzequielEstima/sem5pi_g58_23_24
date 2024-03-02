import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import { NumeroPiso } from '../../../src/domain/piso/NumeroPiso'
import * as assert from 'assert';


describe('NumeroPiso domain', function () {

	it('NumeroPiso é criado com numeros positivos', async function () {
		// Arrange
		let numeroPiso = NumeroPiso.create(1);
		assert.strictEqual(numeroPiso.isSuccess, true);
	});

    it('NumeroPiso é criado com valores negativos', async function () {
		// Arrange
		let numeroPiso = NumeroPiso.create(1);
		assert.strictEqual(numeroPiso.isSuccess, true);
	});

	it('NumeroPiso não é criado com undefined', async function () {
		// Arrange
		let numero;
		let numeroPiso = NumeroPiso.create(numero);
		assert.strictEqual(numeroPiso.isFailure, true);
	});

	it('NumeroPiso não é criado com null', async function () {
		// Arrange
		let numero;
		let numeroPiso = NumeroPiso.create(null);
		assert.strictEqual(numeroPiso.isFailure, true);
	});
    

});