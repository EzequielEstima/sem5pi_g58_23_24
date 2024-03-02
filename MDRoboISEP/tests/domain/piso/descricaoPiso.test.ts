import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import {DescricaoPiso} from '../../../src/domain/piso/DescricaoPiso'
import * as assert from 'assert';


describe('DescricaoPiso domain', function () {

	it('DescricaoPiso é criado com uma string vazia', async function () {
		// Arrange
		let descricaoPiso = DescricaoPiso.create("");
		assert.strictEqual(descricaoPiso.isSuccess, true);
	});

    it('DescricaoPiso é criado com uma string', async function () {
		// Arrange
		let descricaoPiso = DescricaoPiso.create("OLA");
		assert.strictEqual(descricaoPiso.isSuccess, true);
	});

    it('DescricaoPiso não é criado com uma string com mais de 255 caracteres', async function () {
		// Arrange
		let descricaoPiso = DescricaoPiso.create("qwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwer"
         + "qwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwer"
         + "qwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwerqwer");
		assert.strictEqual(descricaoPiso.isFailure, true);
	});

	it('DescricaoPiso não é criado com valor undefined ', async function () {
		// Arrange
		let descricao;
		let descricaoPiso = DescricaoPiso.create(descricao);
		assert.strictEqual(descricaoPiso.isFailure, true);
	});

	it('DescricaoPiso é criado com null', async function () {
		// Arrange
		let descricaoPiso = DescricaoPiso.create(null);
		assert.strictEqual(descricaoPiso.isFailure, true);
	});


});
