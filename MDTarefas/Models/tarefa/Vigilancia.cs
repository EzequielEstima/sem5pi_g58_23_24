using MDTarefas.Models.tarefa.ValueObjects;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa
{
    public class Vigilancia : Tarefa {
        private Contacto Contacto = null!;
        private CodEdificio CodEdificio = null!;
        private NumeroPiso NumeroPiso = null!;

        public Vigilancia(string nome, string numero, 
                            string codEdificio, int numeroPiso,
                            string percurso, string email, string id, string codDispositivo) : base(id, percurso, email, codDispositivo) {
            this.Contacto = new Contacto(new Nome(nome), new NumeroTelefone(numero));
            this.CodEdificio = new CodEdificio(codEdificio);
            this.NumeroPiso = new NumeroPiso(numeroPiso);
        }
        
        //FOR PERSISTANCE
        public Vigilancia(string nome, string numero, 
                            string codEdificio, int numeroPiso,
                            string percurso, string email, string id, string codDispositivo, string estado) : base(id, percurso, email, codDispositivo, estado) {
            this.Contacto = new Contacto(new Nome(nome), new NumeroTelefone(numero));
            this.CodEdificio = new CodEdificio(codEdificio);
            this.NumeroPiso = new NumeroPiso(numeroPiso);
        }

        public string getContactoNomeString() {
            return this.Contacto.getNomeString();
        }

        public string getContactoNumeroString() {
            return this.Contacto.getNumeroTelefoneString();
        }

        public string getCodEdificioString() {
            return this.CodEdificio.getCodEdificioString();
        }

        public int getNumeroPisoInt() {
            return this.NumeroPiso.getNumeroPiso();
        }
    }

}