using MDTarefas.Models.exceptions;
using MDTarefas.utils;

namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class CodEdificio
    {
        private string CodEdificioString = null!;

        public CodEdificio(string codEdificio)
        {
            if (StringValidations.isNullEmptyOrBlank(codEdificio))
            {
                throw new BusinessRuleValidationException("Código do edifício não pode ser nulo, vazio ou apenas conter espaços");
            }

            this.CodEdificioString = codEdificio;
        }

        public string getCodEdificioString()
        {
            return this.CodEdificioString;
        }

    }
}