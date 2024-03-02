namespace MDTarefas.Models.tarefa.ValueObjects
{
    public class NumeroPiso
    {
        private int NumeroPisoValue;

        public NumeroPiso(int numeroPiso)
        {
            this.NumeroPisoValue = numeroPiso;
        }

        public int getNumeroPiso()
        {
            return this.NumeroPisoValue;
        }
    }
}