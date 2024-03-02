using MDTarefas.Models.tarefa.ValueObjects;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.Models.tarefa
{
    public abstract class Tarefa
    {
        private string Id;
        private Estado Estado = null!;

        private Percurso Percurso = null!;
        
        private EmailRequisitor EmailRequisitor = null!;

        private string CodDispositivo = null!;

        public Tarefa(string id, string percurso, string emailRequisitor, string codDispositivo) {
            this.Id = id;
            this.Estado = new Estado(EstadoEnum.Pendente);
            this.Percurso = new Percurso(percurso);
            this.EmailRequisitor = new EmailRequisitor(emailRequisitor);
            this.CodDispositivo = codDispositivo;
        }

        //FOR PERSISTANCE
        public Tarefa(string id, string percurso, string emailRequisitor, string codDispositivo, string estado) {
            this.Id = id;
            this.Estado = new Estado(estado);
            this.Percurso = new Percurso(percurso);
            this.EmailRequisitor = new EmailRequisitor(emailRequisitor);
            this.CodDispositivo = codDispositivo;
        }

        public void updateId(string id) {
            this.Id = id;
        }

        public string getId() {
            return this.Id;
        }

        public string getEstadoString() {
            return this.Estado.getEstadoString();
        }

        public void updateEstado(string estado) {
            this.Estado = new Estado(estado);
        }

        public void updateCodigoRobo(string codigo) {
            this.CodDispositivo = codigo;
        }

        public string getPercursoString() {
            return this.Percurso.getPercursoString();
        }

        public string getEmailRequisitorString() {
            return this.EmailRequisitor.getEmailRequisitorString();
        }

        public string getCodDispositivo() {
            return this.CodDispositivo;
        }

    }
}