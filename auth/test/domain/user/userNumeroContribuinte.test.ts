import { expect } from 'chai';
import { it } from 'mocha';
import { UserNumeroContribuinte } from '../../../src/domain/user/userNumeroContribuinte'
describe('Numero de Contribuinte do Utilizador', () => {

    it('Criação de um numero de contribuinte com sucesso', () => {
        const numeroContribuinte = UserNumeroContribuinte.create("123456789");
        expect(true).to.equal(numeroContribuinte.isSuccess);
    } );
    it('Criação de um numero de contribuinte inválido', () => {
        const numeroContribuinte = UserNumeroContribuinte.create("12345678");
        expect("O numero de contribuinte tem que ter 9 digitos.").to.equal(numeroContribuinte.errorValue());
        expect(true).to.equal(numeroContribuinte.isFailure);
    });
    
});