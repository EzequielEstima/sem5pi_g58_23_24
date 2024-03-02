using MDTarefas.Models.exceptions;
using MDTarefas.utils;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class EmailRequisitor {
        private string EmailString = null!;

        public EmailRequisitor(string email) {
            if (StringValidations.isNullEmptyOrBlank(email)) {
                throw new BusinessRuleValidationException("Email do requisitor não pode ser nulo, vazio ou apenas conter espaços");
            }
            this.EmailString = email.Trim();
        }

        public string getEmailRequisitorString() {
            return this.EmailString;
        }
    }
}