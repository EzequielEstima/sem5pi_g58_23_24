using MDTarefas.Models.tarefa.ValueObjects;
using MDTarefas.Models.exceptions;

namespace MDTarefasTest.Unit;

public class CodConfirmacaoTest
{
    [Fact]
    public void ensureCodConfirmacaoNotNull() {
        
        Action act = () => new CodConfirmacao(null);

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Código de confirmação deve ser um número com 4 a 6 dígitos",exception.Message);

    }

    [Fact]
    public void ensureCodConfirmacaoNotBlank() {
        
        Action act = () => new CodConfirmacao("");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Código de confirmação deve ser um número com 4 a 6 dígitos",exception.Message);

    }

    [Fact]
    public void ensureCodConfirmacaoCantHaveMoreThan6Digits() {
        
        Action act = () => new CodConfirmacao("1234567");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Código de confirmação deve ser um número com 4 a 6 dígitos",exception.Message);

    }

    [Fact]
    public void ensureCodConfirmacaoCantHaveLessThan4Digits() {
        
        Action act = () => new CodConfirmacao("123");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Código de confirmação deve ser um número com 4 a 6 dígitos",exception.Message);

    }

    [Fact]
    public void ensureCodConfirmacaoCantHaveLetters() {
        
        Action act = () => new CodConfirmacao("1234a");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Código de confirmação deve ser um número com 4 a 6 dígitos",exception.Message);

    }

    [Fact]
    public void ensureCodConfirmacaoCantHaveSpecialChars() {
        
        Action act = () => new CodConfirmacao("1234$");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Código de confirmação deve ser um número com 4 a 6 dígitos",exception.Message);

    }

    [Fact]
    public void ensureValidCodConfirmacaoIsCreated() {
        
        var codConfirmacao = new CodConfirmacao("123456"); 
        
        Assert.NotNull(codConfirmacao);
        Assert.Equal("123456",codConfirmacao.getCodConfirmacaoString());

    }
}