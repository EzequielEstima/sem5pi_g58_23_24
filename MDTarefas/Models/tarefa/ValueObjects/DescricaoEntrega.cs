using MDTarefas.Models.exceptions;
using MDTarefas.utils;

namespace MDTarefas.Models.tarefa.ValueObjects{
    public class DescricaoEntrega {
        private string DescricaoEntregaString = null!;

        public DescricaoEntrega(string descricaoEntregaString) {
            if (StringValidations.isNullEmptyOrBlank(descricaoEntregaString) || 
                !StringValidations.isAlphanumericOrWhiteSpace(descricaoEntregaString) || 
                !StringValidations.hasLengthLessOrEqualTo(descricaoEntregaString, 1000) ) {
                throw new BusinessRuleValidationException("Descrição de entrega deve ter apenas caracteres alfuanuméricos e espaços, ter no máximo 1000 caracteres e não pode ser vazia, nula ou apenas conter espaços");
            }
            this.DescricaoEntregaString = descricaoEntregaString.Trim();
        }

        public string getDescricaoEntregaString() {
            return this.DescricaoEntregaString;
        }
    }
}