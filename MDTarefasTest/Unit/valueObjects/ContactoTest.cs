using MDTarefas.Models.tarefa.ValueObjects;
using MDTarefas.Models.exceptions;

namespace MDTarefasTest.Unit;

public class ContactoTest {

    [Fact]
    public void ensureNomeContactoNotNull() {
        
        Action act = () => new Contacto(null,new NumeroTelefone("123456789"));

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Nome e número de telefone não podem ser nulos",exception.Message);
    }

    [Fact]
    public void ensureNumeroTelefoneContactoNotNull() {
        
        Action act = () => new Contacto(new Nome("Nome1") , null);

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Nome e número de telefone não podem ser nulos",exception.Message);
    }


    [Fact]
    public void ensureValidContactoIsCreated() {
        
        var contacto =  new Contacto(new Nome("Nome1") , new NumeroTelefone("123456789"));

        Assert.NotNull(contacto);
        Assert.Equal("Nome1",contacto.getNomeString());
        Assert.Equal("123456789",contacto.getNumeroTelefoneString());
    }
}