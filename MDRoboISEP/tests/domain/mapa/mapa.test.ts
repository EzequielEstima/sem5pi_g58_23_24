import { expect } from 'chai';
import { TipoPonto } from '../../../src/domain/mapa/TipoPonto';
import { Mapa } from '../../../src/domain/mapa/Mapa';
import { Container } from 'typedi';
import { IdMapa } from '../../../src/domain/mapa/IdMapa';

describe('teste de mapa', () => {

    beforeEach(function() {
        Container.reset();
        let mapaTipoPonto : TipoPonto[][] = [];
        let mapa = Mapa.create({mapa:mapaTipoPonto}, IdMapa.create(1).getValue()).getValue();
        for(let i = 0; i <= 10; i++){
            mapaTipoPonto[i] = [];
            for(let j = 0; j <= 10; j++){
                mapaTipoPonto[i][j] = TipoPonto.create(" ").getValue();
            }
        }
        mapa.carregarMapaComBermas();
        Container.set("mapa", mapa);
    });

    it('Método verificar mapa vazio',() => {
        let mapaTipoPontoVazio : TipoPonto[][] = [];
        for(let i = 0; i < 10; i++){
            mapaTipoPontoVazio[i] = [];
            for(let j = 0; j < 10; j++){
                mapaTipoPontoVazio[i][j] = TipoPonto.create(" ").getValue();
            }
        }
        let mapa = Mapa.create({mapa:mapaTipoPontoVazio}, IdMapa.create(2).getValue()).getValue();

        expect(mapa.verificarSeMapaVazio()).to.equal(true);
    });

    it('Carregar pontos para passagem oeste', async function () {
		let mapa = Container.get("mapa") as Mapa;
        let passagem = {
            id : 1,
            abcissa : 0,
            ordenada : 0,
            orientacao : "Oeste",
        }
		mapa.carregarPassagemMapa(passagem);
		expect(mapa.props.mapa[0][0].returnTipoPonto()).to.equal("PassagemNorte");
        expect(mapa.props.mapa[0][1].returnTipoPonto()).to.equal("Passagem");
	});

	it('Carregar pontos para passagem sul', async function () {
        let mapa = Container.get("mapa") as Mapa;
        let passagem = {
            id : 1,
            abcissa : 0,
            ordenada : 10,
            orientacao : "Norte",
        }
        mapa.carregarPassagemMapa(passagem);
		expect(mapa.props.mapa[0][10].returnTipoPonto()).to.equal("Passagem");
        expect(mapa.props.mapa[1][10].returnTipoPonto()).to.equal("Passagem");
	});

    it('Carregar pontos para passagem este', async function () {
        let mapa = Container.get("mapa") as Mapa;
        let passagem = {
            id : 1,
            abcissa : 10,
            ordenada : 0,
            orientacao : "Oeste",
        }
        mapa.carregarPassagemMapa(passagem);
        expect(mapa.props.mapa[10][0].returnTipoPonto()).to.equal("Passagem");
        expect(mapa.props.mapa[10][1].returnTipoPonto()).to.equal("Passagem");
    });

    it('Carregar pontos para passagem norte', async function () {
        let mapa = Container.get("mapa") as Mapa;
        let passagem = {
            id : 1,
            abcissa : 0,
            ordenada : 0,
            orientacao : "Norte",
        }
        mapa.carregarPassagemMapa(passagem);
        expect(mapa.props.mapa[0][0].returnTipoPonto()).to.equal("PassagemOeste");
        expect(mapa.props.mapa[1][0].returnTipoPonto()).to.equal("Passagem");
    });

    it('Carregar pontos para elevador', async function () {
        let mapa = Container.get("mapa") as Mapa;

        mapa.criarPontosElevador(5,5,"Norte");

        expect(mapa.props.mapa[5][5].returnTipoPonto()).to.equal("Elevador");
    });

    it('Carregar pontos para sala',async function(){
        let mapa = Container.get("mapa") as Mapa;

        mapa.carregarSalaMapa("sala",0,0,2,2,1,0,"Norte");

        expect(mapa.props.mapa[0][0].returnTipoPonto()).to.equal("NorteOeste");
        expect(mapa.props.mapa[0][1].returnTipoPonto()).to.equal("Oeste");
        expect(mapa.props.mapa[0][2].returnTipoPonto()).to.equal("Oeste");
        expect(mapa.props.mapa[0][3].returnTipoPonto()).to.equal("NorteOeste");
        expect(mapa.props.mapa[1][0].returnTipoPonto()).to.equal("PortaNorte");
        expect(mapa.props.mapa[2][0].returnTipoPonto()).to.equal("Norte");
        expect(mapa.props.mapa[3][0].returnTipoPonto()).to.equal("NorteOeste");
        expect(mapa.props.mapa[3][1].returnTipoPonto()).to.equal("Oeste");
        expect(mapa.props.mapa[3][2].returnTipoPonto()).to.equal("Oeste");
        expect(mapa.props.mapa[3][3].returnTipoPonto()).to.equal(" ");
        expect(mapa.props.mapa[1][3].returnTipoPonto()).to.equal("Norte");
        expect(mapa.props.mapa[2][3].returnTipoPonto()).to.equal("Norte");
    });

    it('Criar berma mapa', async function () {
        let mapaTipoPontoVazio : TipoPonto[][] = [];
        for(let i = 0; i <= 3; i++){
            mapaTipoPontoVazio[i] = [];
            for(let j = 0; j <= 3; j++){
                mapaTipoPontoVazio[i][j] = TipoPonto.create(" ").getValue();
            }
        }
        let mapa = Mapa.create({mapa:mapaTipoPontoVazio}, IdMapa.create(2).getValue()).getValue();
        mapa.criacaoBermasPiso();

        expect(mapa.props.mapa[0][0].returnTipoPonto()).to.equal("NorteOeste");
        expect(mapa.props.mapa[0][1].returnTipoPonto()).to.equal("Oeste");
        expect(mapa.props.mapa[0][2].returnTipoPonto()).to.equal("Oeste");
        expect(mapa.props.mapa[0][3].returnTipoPonto()).to.equal("Norte");
        expect(mapa.props.mapa[1][3].returnTipoPonto()).to.equal("Norte");
        expect(mapa.props.mapa[2][3].returnTipoPonto()).to.equal("Norte");
        expect(mapa.props.mapa[3][3].returnTipoPonto()).to.equal(" ");
        expect(mapa.props.mapa[3][2].returnTipoPonto()).to.equal("Oeste");
        expect(mapa.props.mapa[3][1].returnTipoPonto()).to.equal("Oeste");
        expect(mapa.props.mapa[3][0].returnTipoPonto()).to.equal("Oeste");
        expect(mapa.props.mapa[2][0].returnTipoPonto()).to.equal("Norte");
        expect(mapa.props.mapa[1][0].returnTipoPonto()).to.equal("Norte");
    });
});