import { Edificio } from '../../../src/domain/edificio/Edificio';
import {it} from 'mocha';

import {expect} from 'chai';
import { Nome } from '../../../src/domain/edificio/Nome';
import { Codigo } from '../../../src/domain/edificio/Codigo'
import { Dimensao } from '../../../src/domain/edificio/Dimensao';
import { DescricaoEdificio } from '../../../src/domain/edificio/DescricaoEdificio';
import { Piso } from '../../../src/domain/piso/Piso';
import { DescricaoPiso } from '../../../src/domain/piso/DescricaoPiso';
import { IdPiso } from '../../../src/domain/piso/IdPiso';
import { NumeroPiso } from '../../../src/domain/piso/NumeroPiso';
import { Coordenadas } from '../../../src/domain/ponto/Coordenadas';
import { IdPonto } from '../../../src/domain/ponto/IdPonto';
import { Ponto } from '../../../src/domain/ponto/Ponto';
import { TipoPonto } from '../../../src/domain/ponto/TipoPonto';

describe('teste de edificio', () => {
    //Valores válidos para criação de um edificio
    let nome = Nome.create('Edificio A');
    let codigo = Codigo.create('ED01');
    let dimensao = Dimensao.create(10,10);
    let descricao = DescricaoEdificio.create('Edificio A');

    it('Criação de Edifício Válido com atributos não essenciais', () => {
        let edificioProps : any = {
            nome:nome.getValue(),
            listaPisos:[] = [],
            dimensao:dimensao.getValue(),
            descricao:descricao.getValue(),
        };
        const edificio = Edificio.create(edificioProps,codigo.getValue());
        expect(true).to.equal(edificio.isSuccess);
    });

    it('Criação de Edifício Válido apenas com atributos essenciais', () => {
        let edificioProps : any = {
            dimensao:dimensao.getValue(),
            listaPisos:[] = [],
        };
        const edificio = Edificio.create(edificioProps,codigo.getValue());
        expect(true).to.equal(edificio.isSuccess);
    });
    it('Criação de Edifício com Dimensão Null', () => {
        let edificioProps : any = {
            dimensao:null,
        };
        const edificioInvalido = Edificio.create(edificioProps,codigo.getValue());
        expect(false).to.equal(edificioInvalido.isSuccess);
    });
    it('Criação de Edifício com Dimensão Undefined', () => {
        let edificioProps : any = {
            dimensao:undefined,
        };
        const edificioInvalido = Edificio.create(edificioProps,codigo.getValue());
        expect(false).to.equal(edificioInvalido.isSuccess);
    });
    

    it('Edifício não tem elevador', () => {
        let edificioProps : any = {
            dimensao:dimensao.getValue(),
            listaPisos:[] = [],
        };
        const edificio = Edificio.create(edificioProps,codigo.getValue()).getValue();
        expect(false).to.equal(edificio.temElevador());
    });

    it('Posição 2,2,N é válida para colocar elevador num Edifício 10x10', () => {
        let edificioProps : any = {
            dimensao:dimensao.getValue(),
            listaPisos:[] = [],
        };
        const edificio = Edificio.create(edificioProps,codigo.getValue()).getValue();
        const res = edificio.posicaoValidaNoMapa(2,2,'norte');
        expect(true).to.equal(res);
    });

    it('Posição 2,10,N não é válida para colocar elevador num Edifício 10x10', () => {
        let edificioProps : any = {
            dimensao:dimensao.getValue(),
            listaPisos:[] = [],
        };
        const edificio = Edificio.create(edificioProps,codigo.getValue()).getValue();
        const res = edificio.posicaoValidaNoMapa(2,10,'norte');
        expect(false).to.equal(res);
    });

    it('Posição 15,15,N não é válida para colocar elevador num Edifício 10x10', () => {
        let edificioProps : any = {
            dimensao:dimensao.getValue(),
            listaPisos:[] = [],
        };
        const edificio = Edificio.create(edificioProps,codigo.getValue()).getValue();
        const res = edificio.posicaoValidaNoMapa(15,15,'norte');
        expect(false).to.equal(res);
    });

    it('Posição 3,3,O é válida para colocar elevador num Edifício 10x10', () => {
        let edificioProps : any = {
            dimensao:dimensao.getValue(),
            listaPisos:[] = [],
        };
        const edificio = Edificio.create(edificioProps,codigo.getValue()).getValue();
        const res = edificio.posicaoValidaNoMapa(3,3,'oeste');
        expect(true).to.equal(res);
    });

    it('Posição 10,3,N não é válida para colocar elevador num Edifício 10x10', () => {
        let edificioProps : any = {
            dimensao:dimensao.getValue(),
            listaPisos:[] = [],
        };
        const edificio = Edificio.create(edificioProps,codigo.getValue()).getValue();
        const res = edificio.posicaoValidaNoMapa(10,3,'oeste');
        expect(false).to.equal(res);
    });

    it('Posição 15,15,O não é válida para colocar elevador num Edifício 10x10', () => {
        let edificioProps : any = {
            dimensao:dimensao.getValue(),
            listaPisos:[] = [],
        };
        const edificio = Edificio.create(edificioProps,codigo.getValue()).getValue();
        const res = edificio.posicaoValidaNoMapa(15,15,'oeste');
        expect(false).to.equal(res);
    });

    it('Números de piso 1 e 2 retorna os pisos 1 e 2 (edificio tem pisos [1,2])',() =>{
        
        let edificioProps2 : any = {
            nome: Nome.create('Edificio B').getValue(),
            dimensao:Dimensao.create(2,2).getValue(),
            descricao:DescricaoEdificio.create('Edificio B').getValue(),
            listaPisos: [],
        };

        const edificioSemElevador = Edificio.create(edificioProps2,Codigo.create('ED02').getValue()).getValue();

        // Criar 2 pisos
        let pisos: Piso[] = [];
        let contador = 1;
        for (let i = 0; i < 2; i++){
            //Criar o mapa
            let mapa;
                
            let piso = Piso.create({
                numeroPiso:  NumeroPiso.create(i+1).getValue(),
                descricaoPiso: DescricaoPiso.create("Ola").getValue(),
                mapa: mapa,
            }, IdPiso.create(i+1).getValue()).getValue();

            // adicionar para a criação do elevador
            pisos.push(piso);
        }
        
        edificioSemElevador.addPiso(pisos[0]);
        edificioSemElevador.addPiso(pisos[1]);

        const res = edificioSemElevador.pisosCorrespondentes([1,2]);
        const expected = pisos;

        expect(expected.length).to.equal(res.length);
        
        for (let i = 0; i < res.length; i++ ){
            expect(expected[i]).to.equal(res[i]);
        }

    });

    it('Números de piso 1 e 4 retorna o pisos 1 (edificio tem pisos [1,2])',() =>{
        
        let edificioProps2 : any = {
            nome: Nome.create('Edificio B').getValue(),
            dimensao:Dimensao.create(2,2).getValue(),
            descricao:DescricaoEdificio.create('Edificio B').getValue(),
            listaPisos: [],
        };

        const edificioSemElevador = Edificio.create(edificioProps2,Codigo.create('ED02').getValue()).getValue();

        // Criar 2 pisos
        let pisos: Piso[] = [];
        
        for (let i = 0; i < 2; i++){
            //Criar o mapa
            let mapa;
            let piso = Piso.create({
                numeroPiso:  NumeroPiso.create(i+1).getValue(),
                descricaoPiso: DescricaoPiso.create("Ola").getValue(),
                mapa: mapa,
            }, IdPiso.create(i+1).getValue()).getValue();

            // adicionar para a criação do elevador
            pisos.push(piso);
        }
        
        edificioSemElevador.addPiso(pisos[0]);
        edificioSemElevador.addPiso(pisos[1]);

        const res = edificioSemElevador.pisosCorrespondentes([1,4]);
        const expected = pisos;

        expect(expected.length).to.not.equal(res.length);
        expect(expected[0]).to.equal(res[0]);

    });

});