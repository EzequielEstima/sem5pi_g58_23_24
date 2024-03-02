using MDTarefas.Models.tarefa.ValueObjects;
using MDTarefas.Models.exceptions;

namespace MDTarefasTest.Unit;

public class NumeroTelefoneTest
{
    [Fact]
    public void ensureNumeroTelefoneNotNull() {
        
        Action act = () => new NumeroTelefone(null);

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Número de telefone deve ser um número com 9 dígitos",exception.Message);

    }

    [Fact]
    public void ensureNumeroTelefoneNotBlank() {
        
        Action act = () => new NumeroTelefone("");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Número de telefone deve ser um número com 9 dígitos",exception.Message);

    }

    [Fact]
    public void ensureNumeroTelefoneCantHaveLetters() {
        
        Action act = () => new NumeroTelefone("12345678a");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Número de telefone deve ser um número com 9 dígitos",exception.Message);

    }
    [Fact]
    public void ensureNumeroTelefoneCantHaveSpecialChars() {
        
        Action act = () => new NumeroTelefone("123456$%&");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Número de telefone deve ser um número com 9 dígitos",exception.Message);

    }
    [Fact]
    public void ensureNumeroTelefoneCantHaveMoreThan9Digits() {
        
        Action act = () => new NumeroTelefone("1234567890");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Número de telefone deve ser um número com 9 dígitos",exception.Message);

    }
    [Fact]
    public void ensureNumeroTelefoneCantHaveLessThan9Digits() {
        
        Action act = () => new NumeroTelefone("12345");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Número de telefone deve ser um número com 9 dígitos",exception.Message);

    }

    [Fact]
    public void ensureValidNumeroTelefoneIsCreated() {
        
        var numeroTelefone = new NumeroTelefone("123456789");

        Assert.NotNull(numeroTelefone);
        Assert.Equal("123456789",numeroTelefone.getNumeroTelefoneString());

    }
}