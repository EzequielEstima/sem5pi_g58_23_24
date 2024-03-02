using MDTarefas.Models.tarefa.ValueObjects;
using MDTarefas.Models.exceptions;

namespace MDTarefasTest.Unit;

public class NumeroPisoTest
{
    [Fact]
    public void ensureValidNumeroPisoIsCreated() {
        
        var numeroPiso = new NumeroPiso(1); 
        
        Assert.NotNull(numeroPiso);
        Assert.Equal(1,numeroPiso.getNumeroPiso());

    }
}