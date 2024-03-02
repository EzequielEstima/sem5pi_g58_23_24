using MDTarefas.Models.tarefa.ValueObjects;
using MDTarefas.Models.exceptions;

namespace MDTarefasTest.Unit;

public class PercursoTest{

    [Fact]
    public void ensurePercursoNotNull() {
        
        Action act = () => new Percurso(null);

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Percurso não pode ser nulo ou vazio",exception.Message);

    }

    [Fact]
    public void ensurePercursoNotBlank() {
        
        Action act = () => new Percurso("");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Percurso não pode ser nulo ou vazio",exception.Message);

    }

    [Fact]
    public void ensureValidPercursoIsCreated() {
        
        var percurso = new Percurso("[cel(a1,1,1),cel(a1,2,2)]");

        Assert.NotNull(percurso);
        Assert.Equal("[cel(a1,1,1),cel(a1,2,2)]",percurso.getPercursoString());

    }

}