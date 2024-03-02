using MDTarefas.Models.exceptions;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects{
    
    public class Contacto {
        private Nome Nome = null!;
        private NumeroTelefone NumeroTelefone = null!;

        public Contacto(Nome nome, NumeroTelefone numeroTelefone)
        {
            if (nome == null || numeroTelefone == null) {
                throw new BusinessRuleValidationException("Nome e número de telefone não podem ser nulos");
            }
            this.Nome = nome;
            this.NumeroTelefone = numeroTelefone;
        }

        public string getNomeString() {
            return this.Nome.getNomeString();
        }

        public string getNumeroTelefoneString() {
            return this.NumeroTelefone.getNumeroTelefoneString();
        }
    }
    
}
