import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import {Piso} from '../../../src/domain/piso/Piso'
import {DescricaoPiso} from '../../../src/domain/piso/DescricaoPiso'
import {NumeroPiso} from '../../../src/domain/piso/NumeroPiso'
import {IdPiso} from '../../../src/domain/piso/IdPiso'
import {Ponto} from '../../../src/domain/ponto/Ponto'
import { Coordenadas } from '../../../src/domain/ponto/Coordenadas';
import { TipoPonto } from '../../../src/domain/ponto/TipoPonto';
import { IdPonto } from '../../../src/domain/ponto/IdPonto';
import * as assert from 'assert';
import { Container } from 'typedi';

describe('piso domain', function () {

	beforeEach(function() {
        
        Container.reset();

		let descricaoPiso = DescricaoPiso.create("Ola").getValue();
		let idPiso = IdPiso.create(1).getValue();
		let numeroPiso = NumeroPiso.create(1).getValue();
		let mapa;
		/*let pontoArray  : Ponto[][] = [];
		pontoArray[0] = [];
		pontoArray[1] = [];
		pontoArray[2] = [];

		let idPonto00 = IdPonto.create(1).getValue();
		let tipoPonto00 = TipoPonto.create("NorteOeste").getValue();
		let coordenadas00 = Coordenadas.create({abscissa: 0 , ordenada: 0 }).getValue();
		let ponto00 = Ponto.create({coordenadas: coordenadas00,tipoPonto:tipoPonto00},idPonto00).getValue();

		pontoArray[0][0] = ponto00;

		let idPonto01 = IdPonto.create(2).getValue();
		let tipoPonto01 = TipoPonto.create("Norte").getValue();
		let coordenadas01 = Coordenadas.create({abscissa: 0 , ordenada: 1 }).getValue();
		let ponto01 = Ponto.create({coordenadas: coordenadas01,tipoPonto:tipoPonto01},idPonto01).getValue();

		pontoArray[0][1] = ponto01;

		let idPonto02 = IdPonto.create(3).getValue();
		let tipoPonto02 = TipoPonto.create("Oeste").getValue();
		let coordenadas02 = Coordenadas.create({abscissa: 0 , ordenada: 2 }).getValue();
		let ponto02 = Ponto.create({coordenadas: coordenadas02,tipoPonto:tipoPonto02},idPonto02).getValue();

		pontoArray[0][2] = ponto02;

		let idPonto10 = IdPonto.create(4).getValue();
		let tipoPonto10 = TipoPonto.create("Oeste").getValue();
		let coordenadas10 = Coordenadas.create({abscissa: 1 , ordenada: 0 }).getValue();
		let ponto10 = Ponto.create({coordenadas: coordenadas10,tipoPonto:tipoPonto10},idPonto10).getValue();

		pontoArray[1][0] = ponto10;

		let idPonto11 = IdPonto.create(5).getValue();
		let tipoPonto11 = TipoPonto.create(" ").getValue();
		let coordenadas11 = Coordenadas.create({abscissa: 1 , ordenada: 1 }).getValue();
		let ponto11 = Ponto.create({coordenadas: coordenadas11,tipoPonto:tipoPonto11},idPonto11).getValue();

		pontoArray[1][1] = ponto11;

		let idPonto12 = IdPonto.create(6).getValue();
		let tipoPonto12 = TipoPonto.create("Oeste").getValue();
		let coordenadas12 = Coordenadas.create({abscissa: 1 , ordenada: 2 }).getValue();
		let ponto12 = Ponto.create({coordenadas: coordenadas12,tipoPonto:tipoPonto12},idPonto12).getValue();

		pontoArray[1][2] = ponto12;

		let idPonto20 = IdPonto.create(7).getValue();
		let tipoPonto20 = TipoPonto.create("Norte").getValue();
		let coordenadas20 = Coordenadas.create({abscissa: 2 , ordenada: 0 }).getValue();
		let ponto20 = Ponto.create({coordenadas: coordenadas20,tipoPonto:tipoPonto20},idPonto20).getValue();

		pontoArray[2][0] = ponto20;

		let idPonto21 = IdPonto.create(8).getValue();
		let tipoPonto21 = TipoPonto.create("Norte").getValue();
		let coordenadas21 = Coordenadas.create({abscissa: 2 , ordenada: 1 }).getValue();
		let ponto21 = Ponto.create({coordenadas: coordenadas21,tipoPonto:tipoPonto21},idPonto21).getValue();

		pontoArray[2][1] = ponto21;

		let idPonto22 = IdPonto.create(9).getValue();
		let tipoPonto22 = TipoPonto.create("Norte").getValue();
		let coordenadas22 = Coordenadas.create({abscissa: 2 , ordenada: 2 }).getValue();
		let ponto22 = Ponto.create({coordenadas: coordenadas22,tipoPonto:tipoPonto22},idPonto22).getValue();

		pontoArray[2][2] = ponto22;

		let piso = Piso.create({
            numeroPiso: numeroPiso,
            descricaoPiso: descricaoPiso,
            mapa: pontoArray,
        }, idPiso).getValue();
        
		Container.set('piso2x2',piso);

		let pontoArray5x5  : Ponto[][] = [];
		for(let i = 0; i < 5; i++){
			pontoArray5x5[i] = [];
			for(let j = 0; j < 5; j++){
				let idPonto = IdPonto.create(i*5 + j + 1).getValue();
				let tipoPonto = TipoPonto.create(" ").getValue();
				let coordenadas = Coordenadas.create({abscissa: i , ordenada: j }).getValue();
				pontoArray5x5[i][j] = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
			}
		}

		let pontoArray5x5Vazio : Ponto[][] = [];
		for(let i = 0; i < 5; i++){
			pontoArray5x5Vazio[i] = [];
			for(let j = 0; j < 5; j++){
				let idPonto = IdPonto.create(i*5 + j + 1).getValue();
				let tipoPonto = TipoPonto.create(" ").getValue();
				let coordenadas = Coordenadas.create({abscissa: i , ordenada: j }).getValue();
				pontoArray5x5Vazio[i][j] = Ponto.create({coordenadas: coordenadas,tipoPonto:tipoPonto},idPonto).getValue();
			}
		}

		pontoArray5x5[0][0].toParedeNorteOeste();
		pontoArray5x5[1][0].toParedeNorte();
		pontoArray5x5[2][0].toParedeNorte();
		pontoArray5x5[3][0].toParedeNorte();
		pontoArray5x5[4][0].toParedeOeste();
		pontoArray5x5[0][1].toParedeOeste();
		pontoArray5x5[0][2].toParedeOeste();
		pontoArray5x5[0][3].toParedeOeste();
		pontoArray5x5[0][4].toParedeNorte();
		pontoArray5x5[4][1].toParedeOeste();
		pontoArray5x5[4][2].toParedeOeste();
		pontoArray5x5[4][3].toParedeOeste();
		pontoArray5x5[1][4].toParedeNorte();
		pontoArray5x5[2][4].toParedeNorte();
		pontoArray5x5[3][4].toParedeNorte();
		
		

		let piso5x5 = Piso.create({
			numeroPiso: numeroPiso,
			descricaoPiso: descricaoPiso,
			mapa: pontoArray5x5,
		}, idPiso).getValue();
		Container.set ('piso5x5',piso5x5);

		let piso5x5Vazio = Piso.create({
			numeroPiso: numeroPiso,
			descricaoPiso: descricaoPiso,
			mapa: pontoArray5x5Vazio,
		}, idPiso).getValue();
		Container.set ('piso5x5Vazio',piso5x5Vazio);
	*/
	let piso = Piso.create({
		numeroPiso: numeroPiso,
		descricaoPiso: descricaoPiso,
		mapa: mapa,
	}, idPiso).getValue();
	
	Container.set('piso2x2',piso);
		
    });
	

	it('piso é criado com sucesso com descrição', async function () {
		// Arrange
		let descricaoPiso = DescricaoPiso.create("Ola").getValue();
		let idPiso = IdPiso.create(1).getValue();
		let numeroPiso = NumeroPiso.create(1).getValue();
		let mapa;

		let pisoOuErro = await Piso.create({
            numeroPiso: numeroPiso,
            descricaoPiso: descricaoPiso,
            mapa: mapa,
        }, idPiso);

		assert.strictEqual(pisoOuErro.isSuccess, true);
	});


	it('piso é criado com sucesso sem descricao', async function () {
		// Arrange
		let idPiso = IdPiso.create(1).getValue();
		let numeroPiso = NumeroPiso.create(1).getValue();
		let mapa;
	
		let descricao = null;
		let pisoOuErro = await Piso.create({
            numeroPiso: numeroPiso,
            descricaoPiso: null,
            mapa: mapa,
        }, idPiso);

		assert.strictEqual(pisoOuErro.isSuccess, true);
	});

	it('piso não é criado sem numeroPiso', async function () {
		// Arrange
		let descricaoPiso = DescricaoPiso.create("Ola").getValue();
		let idPiso = IdPiso.create(1).getValue();
		let mapa;
		let pisoOuErro = await Piso.create({
            numeroPiso: null,
            descricaoPiso: descricaoPiso,
            mapa: mapa,
        }, idPiso);

		assert.strictEqual(pisoOuErro.isFailure, true);
	});

	/*it('elevador removido 0,0 0,1 com sucesso', async function () {
		// Arrange
		let piso = Container.get("piso2x2") as Piso;

		piso.props.mapa[0][0].toElevador();
		piso.props.mapa[0][1].toElevador();
		
		piso.reverterElevadorNoMapa([0,0,0,1]);

		assert.strictEqual(piso.props.mapa[0][0].returnTipoPonto(), "NorteOeste");
		assert.strictEqual(piso.props.mapa[0][1].returnTipoPonto(), "Oeste");
	});


	it('elevador removido 1,0 1,1 com sucesso', async function () {
		// Arrange
		let piso = Container.get("piso2x2") as Piso;

		piso.props.mapa[1][0].toElevador();
		piso.props.mapa[1][1].toElevador();
		
		piso.reverterElevadorNoMapa([1,0,1,1]);

		assert.strictEqual(piso.props.mapa[1][0].returnTipoPonto(), "Norte");
		assert.strictEqual(piso.props.mapa[1][1].returnTipoPonto(), " ");
	});

	it('elevador removido 2,1 2,2 com sucesso', async function () {
		// Arrange
		let piso = Container.get("piso2x2") as Piso;

		piso.props.mapa[2][1].toElevador();
		piso.props.mapa[2][2].toElevador();
		
		piso.reverterElevadorNoMapa([2,1,2,2]);

		assert.strictEqual(piso.props.mapa[2][1].returnTipoPonto(), "Oeste");
		assert.strictEqual(piso.props.mapa[2][2].returnTipoPonto(), " ");
	});
	*/
	it('atualizarNumeroPiso falha se for undefined', async function () {
		// Arrange
		let piso = Container.get("piso2x2") as Piso;
		let numeroPiso;
		let pisoOuErro = piso.atualizarNumeroPiso(numeroPiso);
		assert.strictEqual(pisoOuErro.isFailure, true);
	});

	it('atualizarNumeroPiso falha se for null', async function () {
		// Arrange
		let piso = Container.get("piso2x2") as Piso;
		let pisoOuErro = piso.atualizarNumeroPiso(null);
		assert.strictEqual(pisoOuErro.isFailure, true);
	});

	it('atualizarNumeroPiso tem sucesso', async function () {
		// Arrange
		let piso = Container.get("piso2x2") as Piso;
		piso.atualizarNumeroPiso(NumeroPiso.create(2).getValue());
		assert.strictEqual(piso.returnNumeroPiso(), 2);
	});

	it('atualizarDescricaoPiso falha se for undefined', async function () {
		// Arrange
		let piso = Container.get("piso2x2") as Piso;
		let descricaoPiso;
		let pisoOuErro = piso.atualizarDescricaoPiso(descricaoPiso);
		assert.strictEqual(pisoOuErro.isFailure, true);
	});

	it('atualizarDescricaoPiso falha se for null', async function () {
		// Arrange
		let piso = Container.get("piso2x2") as Piso;
		let pisoOuErro = piso.atualizarDescricaoPiso(null);
		assert.strictEqual(pisoOuErro.isFailure, true);
	});

	it('atualizarDescricaoPiso tem sucesso', async function () {
		// Arrange
		let piso = Container.get("piso2x2") as Piso;
		let pisoOuErro = piso.atualizarDescricaoPiso(DescricaoPiso.create("adeus").getValue());
		assert.strictEqual(piso.returnDescricaoPiso(), "adeus");
	});

	/*
	it('Return pontos para passagem oeste', async function () {
		let piso = Container.get("piso5x5") as Piso;
		let pontos = piso.returnPontosParaPassagem(0,0,"Oeste");
		assert.equal(pontos[0].returnTipoPonto(), "PassagemNorte");
		assert.equal(pontos[1].returnTipoPonto(), "Passagem");
	});

	it('Return pontos para passagem sul', async function () {
		let piso = Container.get("piso5x5") as Piso;
		let pontos = piso.returnPontosParaPassagem(0,4,"Norte");
		assert.equal(pontos[0].returnTipoPonto(), "Passagem");
		assert.equal(pontos[1].returnTipoPonto(), "Passagem");
	});

	it('Return pontos para passagem este', async function () {
		let piso = Container.get("piso5x5") as Piso;
		let pontos = piso.returnPontosParaPassagem(4,0,"Oeste");
		assert.equal(pontos[0].returnTipoPonto(), "Passagem");
		assert.equal(pontos[1].returnTipoPonto(), "Passagem");
	});

	it('Return pontos para passagem norte', async function () {
		let piso = Container.get("piso5x5") as Piso;
		let pontos = piso.returnPontosParaPassagem(3,0,"Norte");
		assert.equal(pontos[0].returnTipoPonto(), "Passagem");
		assert.equal(pontos[1].returnTipoPonto(), "Passagem");
	});

	it('Return pontos para diagonal sala', async function () {
		let piso = Container.get("piso5x5") as Piso;
		let pontos = piso.returnPontosParaDiagonalSala(3,0,0,3);
		assert.equal(pontos[0].returnAbscissa(), 0);
		assert.equal(pontos[0].returnOrdenada(), 0);
		assert.equal(pontos[1].returnAbscissa(), 3);
		assert.equal(pontos[1].returnOrdenada(), 3);
	});

	it('Return pontos para elevador', async function() {
		let piso = Container.get("piso5x5") as Piso;
		let pontos = piso.returnPontosParaElevador(0,0,"Oeste");
		assert.equal(pontos[0].returnAbscissa(), 0);
		assert.equal(pontos[0].returnOrdenada(), 0);
		assert.equal(pontos[1].returnAbscissa(), 1);
		assert.equal(pontos[1].returnOrdenada(), 0);
	});

	it('Return pontos para paredes sala', async function() {
		let piso = Container.get("piso5x5") as Piso;
		let pontos = piso.returnPontosParaParedesSalas(0,0,3,3,2,0);
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 1 && ponto.returnOrdenada() === 0)?.returnTipoPonto(), "Norte");		
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 2 && ponto.returnOrdenada() === 0)?.returnTipoPonto(), "PortaNorte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 3 && ponto.returnOrdenada() === 0)?.returnTipoPonto(), "Norte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 0 && ponto.returnOrdenada() === 1)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 0 && ponto.returnOrdenada() === 2)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 0 && ponto.returnOrdenada() === 3)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 0 && ponto.returnOrdenada() === 4)?.returnTipoPonto(), "Norte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 1 && ponto.returnOrdenada() === 4)?.returnTipoPonto(), "Norte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 2 && ponto.returnOrdenada() === 4)?.returnTipoPonto(), "Norte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 3 && ponto.returnOrdenada() === 4)?.returnTipoPonto(), "Norte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 4 && ponto.returnOrdenada() === 0)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 4 && ponto.returnOrdenada() === 1)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 4 && ponto.returnOrdenada() === 2)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 4 && ponto.returnOrdenada() === 3)?.returnTipoPonto(), "Oeste");
	});

	it('Criação de bermas edificio 5x5', async function() {
		let piso = Container.get("piso5x5Vazio") as Piso;
		let pontos = piso.criacaoBermasPiso();

		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 0 && ponto.returnOrdenada() === 0)?.returnTipoPonto(), "NorteOeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 1 && ponto.returnOrdenada() === 0)?.returnTipoPonto(), "Norte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 2 && ponto.returnOrdenada() === 0)?.returnTipoPonto(), "Norte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 3 && ponto.returnOrdenada() === 0)?.returnTipoPonto(), "Norte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 4 && ponto.returnOrdenada() === 0)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 0 && ponto.returnOrdenada() === 1)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 0 && ponto.returnOrdenada() === 2)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 0 && ponto.returnOrdenada() === 3)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 0 && ponto.returnOrdenada() === 4)?.returnTipoPonto(), "Norte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 1 && ponto.returnOrdenada() === 4)?.returnTipoPonto(), "Norte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 2 && ponto.returnOrdenada() === 4)?.returnTipoPonto(), "Norte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 3 && ponto.returnOrdenada() === 4)?.returnTipoPonto(), "Norte");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 4 && ponto.returnOrdenada() === 0)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 4 && ponto.returnOrdenada() === 1)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 4 && ponto.returnOrdenada() === 2)?.returnTipoPonto(), "Oeste");
		assert.equal(pontos.find(ponto => ponto.returnAbscissa() === 4 && ponto.returnOrdenada() === 3)?.returnTipoPonto(), "Oeste");
	});

	it('Verificar se piso é vazio correto', async function() {
		let piso = Container.get("piso5x5Vazio") as Piso;
		assert.equal(piso.verificarSeMapaVazio(), true);
	});

	it('Verificar se piso é vazio com algo no mapa', async function() {
		let piso = Container.get("piso5x5Vazio") as Piso;
		piso.props.mapa[0][0].toElevador();
		assert.equal(piso.verificarSeMapaVazio(), false);
	});
	*/
});