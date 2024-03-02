import 'reflect-metadata';

import * as assert from 'assert';
import { DescricaoPiso } from '../../../src/domain/piso/DescricaoPiso';
import { IdPiso } from '../../../src/domain/piso/IdPiso';
import { NumeroPiso } from '../../../src/domain/piso/NumeroPiso';
import { Piso } from '../../../src/domain/piso/Piso';
import CategorizacaoSala from '../../../src/domain/sala/CategorizacaoSala';
import DescricaoSala from '../../../src/domain/sala/DescricaoSala';
import NomeSala from '../../../src/domain/sala/NomeSala';
import { Sala } from '../../../src/domain/sala/Sala';
describe('sala domain', function () {

    it('sala é criado com sucesso', async function () {
        let mapa;

        let pisoA = Piso.create(
            {
                numeroPiso: NumeroPiso.create(0).getValue(),
                descricaoPiso: DescricaoPiso.create("Ola").getValue(),
                mapa: mapa
            },
            IdPiso.create(1).getValue()
        ).getValue();

        let categoriaOrError = CategorizacaoSala.create("Laboratorio").getValue();
        let descricaoOrError = DescricaoSala.create("Sala B300 - Laboratorio de Informatica").getValue();
        let nomeSalaoOrError = NomeSala.create("B300").getValue();

        let salaOrError = Sala.create({
            categoria: categoriaOrError,
            descricao: descricaoOrError,
            piso: pisoA,
        }, nomeSalaoOrError);

        assert.equal(salaOrError.isSuccess, true);
    });

    it('sala não é criado com piso null', async function () {

        let pisoA : Piso;

        let categoriaOrError = CategorizacaoSala.create("Laboratorio").getValue();
        let descricaoOrError = DescricaoSala.create("Sala B300 - Laboratorio de Informatica").getValue();
        let nomeSalaoOrError = NomeSala.create("B300").getValue();

        let salaOrError = Sala.create({
            categoria: categoriaOrError,
            descricao: descricaoOrError,
            piso: pisoA,
        }, nomeSalaoOrError);

        assert.equal(salaOrError.errorValue(), "piso is null or undefined");
    });

    it('sala não é criado com categoria null', async function () {

        let mapa;

        let pisoA = Piso.create(
            {
                numeroPiso: NumeroPiso.create(0).getValue(),
                descricaoPiso: DescricaoPiso.create("Ola").getValue(),
                mapa: mapa
            },
            IdPiso.create(1).getValue()
        ).getValue();

        let categoriaOrError : CategorizacaoSala;
        let descricaoOrError = DescricaoSala.create("Sala B300 - Laboratorio de Informatica").getValue();
        let nomeSalaoOrError = NomeSala.create("B300").getValue();

        let salaOrError = Sala.create({
            categoria: categoriaOrError,
            descricao: descricaoOrError,
            piso: pisoA,
        }, nomeSalaoOrError);

        assert.equal(salaOrError.errorValue(), "categoria is null or undefined");
    });

    it('sala não é criado com descricao null', async function () {

        let mapa;

        let pisoA = Piso.create(
            {
                numeroPiso: NumeroPiso.create(0).getValue(),
                descricaoPiso: DescricaoPiso.create("Ola").getValue(),
                mapa: mapa
            },
            IdPiso.create(1).getValue()
        ).getValue();

        let categoriaOrError = CategorizacaoSala.create("Laboratorio").getValue();
        let descricaoOrError : DescricaoSala;
        let nomeSalaoOrError = NomeSala.create("B300").getValue();

        let salaOrError = Sala.create({
            categoria: categoriaOrError,
            descricao: descricaoOrError,
            piso: pisoA,
        }, nomeSalaoOrError);

        assert.equal(salaOrError.errorValue(), "descricao is null or undefined");
    });

});