using MDTarefas.Models.tarefa.ValueObjects;
using MDTarefas.Models.exceptions;


namespace MDTarefasTest.Unit
{
    public class EstadoTest
    {
        [Fact]
        public void ensureEstadoPendenteIsCorrectString()
        {
            Estado estado = new Estado(EstadoEnum.Pendente);
            Assert.Equal("Pendente", estado.getEstadoString());
        }

        [Fact]
        public void ensureEstadoAceiteIsCorrectString()
        {
            Estado estado = new Estado(EstadoEnum.Aceite);
            Assert.Equal("Aceite", estado.getEstadoString());
        }

        [Fact]
        public void ensureEstadoRejeitadaIsCorrectString()
        {
            Estado estado = new Estado(EstadoEnum.Rejeitada);
            Assert.Equal("Rejeitada", estado.getEstadoString());
        }

        [Fact]
        public void ensureEstadoRejeitadaIsCorrectStringIfCreatedWithString()
        {
            Estado estado = new Estado("Rejeitada");
            Assert.Equal("Rejeitada", estado.getEstadoString());
        }

        [Fact]
        public void ensureEstadoAceiteIsCorrectStringIfCreatedWithString()
        {
            Estado estado = new Estado("Aceite");
            Assert.Equal("Aceite", estado.getEstadoString());
        }

        [Fact]
        public void ensureEstadoPendenteIsCorrectStringIfCreatedWithString()
        {
            Estado estado = new Estado("Pendente");
            Assert.Equal("Pendente", estado.getEstadoString());
        }

        [Fact]
        public void ensureEstadoThrowsErrorIfStringIsntValid()
        {   
            Assert.Throws<BusinessRuleValidationException>(() => new Estado("asasq"));
        }

    }
}