using MDTarefas.Models.tarefa;

namespace MDTarefasTest.Unit
{
    public class VigilanciaTest
    {
        [Fact]
        public void ensureVigilanciaGetIdIsCorrect()
        {
            Vigilancia vigilancia = new Vigilancia("nome", "123456789","A", 1, "percurso", "email", "id", "ROBO");
            Assert.Equal("id", vigilancia.getId());
        }

        [Fact]
        public void ensureEstadoVigilanciaIsPendingWhenCreating()
        {
            Vigilancia vigilancia = new Vigilancia("nome", "123456789", "A", 1, "percurso", "email", "id", "ROBO");
            Assert.Equal("Pendente", vigilancia.getEstadoString());
        }

        [Fact]
        public void ensureVigilanciaGetPercursoStringIsCorrect()
        {
            Vigilancia vigilancia = new Vigilancia("nome", "123456789", "A", 1, "percurso", "email", "id", "ROBO");
            Assert.Equal("percurso", vigilancia.getPercursoString());
        }

        [Fact]
        public void ensureVigilanciaGetEmailRequisitorStringIsCorrect()
        {
            Vigilancia vigilancia = new Vigilancia("nome", "123456789", "A", 1, "percurso", "email", "id", "ROBO");
            Assert.Equal("email", vigilancia.getEmailRequisitorString());
        }

        [Fact]
        public void ensureVigilanciaGetContactoNomeStringIsCorrect()
        {
            Vigilancia vigilancia = new Vigilancia("nome", "123456789", "A", 1, "percurso", "email", "id", "ROBO");
            Assert.Equal("nome", vigilancia.getContactoNomeString());
        }

        [Fact]
        public void ensureVigilanciaGetContactoNumeroStringIsCorrect()
        {
            Vigilancia vigilancia = new Vigilancia("nome", "123456789", "A", 1, "percurso", "email", "id", "ROBO");
            Assert.Equal("123456789", vigilancia.getContactoNumeroString());
        }
    }
}