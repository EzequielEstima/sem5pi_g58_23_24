using MDTarefas.Models.tarefa.ValueObjects;
using MDTarefas.Models.exceptions;

namespace MDTarefasTest.Unit;

public class NomeTest
{
    [Fact]
    public void ensureNameNotNull() {
        
        Action act = () => new Nome(null);

        var exception = Assert.Throws<BusinessRuleValidationException>(act);


        Assert.Equal("Nome não pode ser nulo, vazio ou apenas conter espaços",exception.Message);

    }

    [Fact]
    public void ensureNameNotEmpty() {
        
        Action act = () => new Nome("");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Nome não pode ser nulo, vazio ou apenas conter espaços",exception.Message);

    }

    [Fact]
    public void ensureNameNotBlank() {
        
        Action act = () => new Nome("       ");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Nome não pode ser nulo, vazio ou apenas conter espaços",exception.Message);

    }

    [Fact]
    public void ensureValidNameIsCreated() {
        
        var nome = new Nome("Marco Batista Alejandro Estima"); 
        
        Assert.NotNull(nome);
        Assert.Equal("Marco Batista Alejandro Estima",nome.getNomeString());

    }
}