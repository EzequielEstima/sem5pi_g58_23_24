using MDTarefas.Models.exceptions;
using MDTarefas.utils;

namespace MDTarefas.Models.tarefa.ValueObjects{

    public class NomeSala{
        private string NomeSalaString = null!;

        public NomeSala(string nomeSala) {
            if(StringValidations.isNullEmptyOrBlank(nomeSala)) {
                throw new BusinessRuleValidationException("Nome da sala não pode ser nulo, vazio ou apenas conter espaços");
            }
            this.NomeSalaString = nomeSala.Trim();
        }

        public string getNomeSalaString() {
            return this.NomeSalaString;
        }
    }

}