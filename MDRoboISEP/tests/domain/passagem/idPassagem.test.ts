import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import { IdPassagem } from '../../../src/domain/passagem/IdPassagem'
import * as assert from 'assert';


describe('IdPassagem domain', function () {

	it('IdPassagem é criado com sucesso', async function () {
		// Arrange
		let idPassagem = IdPassagem.create(1);
		assert.strictEqual(idPassagem.isSuccess, true);
	});

    it('IdPassagem não é criado com zero', async function () {
		// Arrange
		let idPiso = IdPassagem.create(0);
		assert.strictEqual(idPiso.isFailure, true);
	});

    it('IdPassagem não é criado com menos do que zero', async function () {
		// Arrange
		let idPiso = IdPassagem.create(-1);
		assert.strictEqual(idPiso.isFailure, true);
	});

    it('IdPassagem não é criado quando é null', async function () {
		// Arrange
        let n : number;
        n = null as any;
		let idPiso = IdPassagem.create(n);
		assert.strictEqual(idPiso.isFailure, true);
	});


});

