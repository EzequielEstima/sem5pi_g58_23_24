using MDTarefas.Models.tarefa.ValueObjects;
using MDTarefas.Models.exceptions;

namespace MDTarefasTest.Unit;

public class EmailRequisitorTest{

    [Fact]
    public void ensureEmailRequisitorNotNull() {
        
        Action act = () => new EmailRequisitor(null);

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Email do requisitor não pode ser nulo, vazio ou apenas conter espaços",exception.Message);

    }

    [Fact]
    public void ensureEmailRequisitorNotEmpty() {
        
        Action act = () => new EmailRequisitor("");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Email do requisitor não pode ser nulo, vazio ou apenas conter espaços",exception.Message);

    }

    [Fact]
    public void ensureEmailRequisitorNotBlank() {
        
        Action act = () => new EmailRequisitor("          ");

        var exception = Assert.Throws<BusinessRuleValidationException>(act);

        Assert.Equal("Email do requisitor não pode ser nulo, vazio ou apenas conter espaços",exception.Message);

    }

    [Fact]
    public void ensureValidEmailRequisitorIsCreated() {
        
        var emailRequisitor = new EmailRequisitor("eskama@eskama.pt");

        Assert.NotNull(emailRequisitor);
        Assert.Equal("eskama@eskama.pt",emailRequisitor.getEmailRequisitorString());

    }


}