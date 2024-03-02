using MDTarefas.Models.exceptions;
using MDTarefas.utils;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects{

    public class Nome {
        private string NomeString = null!;

        public Nome(string nomeString) {
            if (StringValidations.isNullEmptyOrBlank(nomeString) ) {
                throw new BusinessRuleValidationException("Nome não pode ser nulo, vazio ou apenas conter espaços");
            }
            this.NomeString = nomeString.Trim();
        }

        public string getNomeString() {
            return this.NomeString;
        }
    }
    
}
