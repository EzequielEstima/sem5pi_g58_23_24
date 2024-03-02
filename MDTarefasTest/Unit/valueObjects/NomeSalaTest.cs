using MDTarefas.Models.tarefa.ValueObjects;
using MDTarefas.Models.exceptions;

namespace MDTarefasTest.Unit;

public class NomeSalaTest
{
    [Fact]
    public void ensureNomeSalaNotNull() {
        
        Action act = () => new NomeSala(null);

        var exception = Assert.Throws<BusinessRuleValidationException>(act);


        Assert.Equal("Nome da sala não pode ser nulo, vazio ou apenas conter espaços",exception.Message);

    }

    [Fact]
    public void ensureNomeSalaNotBlank() {
        
        Action act = () => new NomeSala("           ");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Nome da sala não pode ser nulo, vazio ou apenas conter espaços",exception.Message);

    }

    [Fact]
    public void ensureNomeSalaNotEmpty() {
        
        Action act = () => new NomeSala("");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Nome da sala não pode ser nulo, vazio ou apenas conter espaços",exception.Message);

    }

    [Fact]
    public void ensureValidNomeSalaIsCreated() {
        
        var nomeSala = new NomeSala("A202"); 
        
        Assert.NotNull(nomeSala);
        Assert.Equal("A202",nomeSala.getNomeSalaString());

    }
}