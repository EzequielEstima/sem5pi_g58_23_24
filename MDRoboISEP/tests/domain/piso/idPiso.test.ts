import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import {IdPiso} from '../../../src/domain/piso/IdPiso'
import * as assert from 'assert';


describe('IdPiso domain', function () {

	it('IdPiso é criado com numeros positivos', async function () {
		// Arrange
		let idPiso = IdPiso.create(1);
		assert.strictEqual(idPiso.isSuccess, true);
	});

    it('IdPiso não é criado com numeros negativos', async function () {
		// Arrange
		let idPiso = IdPiso.create(-1);
		assert.strictEqual(idPiso.isFailure, true);
	});

    it('IdPiso não é criado quando é igual a 0', async function () {
		// Arrange
		let idPiso = IdPiso.create(0);
		assert.strictEqual(idPiso.isFailure, true);
	});

	it('IdPiso não é criado com undefined', async function () {
		// Arrange
		let id;
		let idPiso = IdPiso.create(id);
		assert.strictEqual(idPiso.isFailure, true);
	});

	it('IdPiso não é criado com null', async function () {
		// Arrange
		let idPiso = IdPiso.create(null);
		assert.strictEqual(idPiso.isFailure, true);
	});

});

