using MDTarefas.Models.tarefa.ValueObjects;
using MDTarefas.Models.exceptions;

namespace MDTarefasTest.Unit;

public class CodEdificioTest
{
    [Fact]
    public void ensureCodEdificioNotNull() {
        
        Action act = () => new CodEdificio(null);

        var exception = Assert.Throws<BusinessRuleValidationException>(act);


        Assert.Equal("Código do edifício não pode ser nulo, vazio ou apenas conter espaços",exception.Message);

    }

    [Fact]
    public void ensureCodEdificioNotEmpty() {
        
        Action act = () => new CodEdificio("");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Código do edifício não pode ser nulo, vazio ou apenas conter espaços",exception.Message);

    }

    [Fact]
    public void ensureCodEdificioNotBlank() {
        
        Action act = () => new CodEdificio("    ");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Código do edifício não pode ser nulo, vazio ou apenas conter espaços",exception.Message);

    }

    [Fact]
    public void ensureValidCodEdificioIsCreated() {
        
        var codEd = new CodEdificio("A"); 
        
        Assert.NotNull(codEd);
        Assert.Equal("A",codEd.getCodEdificioString());

    }
}