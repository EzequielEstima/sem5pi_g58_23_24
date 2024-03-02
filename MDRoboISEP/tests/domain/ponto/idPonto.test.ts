import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import {IdPonto} from '../../../src/domain/ponto/IdPonto'
import * as assert from 'assert';


describe('IdPonto domain', function () {

	it('IdPonto é criado com um numero', async function () {
		// Arrange
		let idPonto = IdPonto.create(1);
		assert.strictEqual(idPonto.isSuccess, true);
	});

    it('IdPonto não é criado com 0', async function () {
		// Arrange
		let idPonto = IdPonto.create(0);
		assert.strictEqual(idPonto.isFailure, true);
	});


    it('IdPonto não é criado com uma string com valor undefined', async function () {
		// Arrange
		let ponto;
		let idPonto = IdPonto.create(ponto);
		assert.strictEqual(idPonto.isFailure, true);
	});

});