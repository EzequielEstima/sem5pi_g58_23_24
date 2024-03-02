using MDTarefas.Models.exceptions;
using MDTarefas.utils;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects{
    public class NumeroTelefone {
        private string NumeroTelefoneString = null!;

        public NumeroTelefone(string numeroTelefoneString) {
            if ( StringValidations.isNullEmptyOrBlank(numeroTelefoneString) ||
                !StringValidations.isNumeric(numeroTelefoneString) || 
                numeroTelefoneString.Length != 9) {
                throw new BusinessRuleValidationException("Número de telefone deve ser um número com 9 dígitos");
            }
            this.NumeroTelefoneString = numeroTelefoneString;
        }

        public string getNumeroTelefoneString() {
            return this.NumeroTelefoneString;
        }
    }
}


