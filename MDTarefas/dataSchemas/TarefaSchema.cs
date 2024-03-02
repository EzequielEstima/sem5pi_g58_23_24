using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MDTarefas.dataSchemas{


    public class TarefaSchema
    {
        public string TipoTarefa { get; set; } = null!; // "PickUpDelivery" or "Vigilancia"
        // For both types of Tarefa
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        public string PercursoString { get; set; } = null!;
        public string EstadoString { get; set; } = null!;
        public string EmailRequisitor { get; set; } = null!;
        public string? CodDispositivo { get; set; }

        // For PickUp&Delivery
        public string? CodConfirmacao { get; set; }
        public string? DescricaoEntrega { get; set; }
        public string? NomePickUp { get; set; }
        public string? NumeroPickUp { get; set; }
        public string? NomeDelivery { get; set; }
        public string? NumeroDelivery { get; set; }
        public string? SalaInicial { get; set; }
        public string? SalaFinal { get; set; }

        // For Vigilancia
        public string? NomeVigilancia { get; set; }
        public string? NumeroVigilancia { get; set; }
        
        public string? CodEdificio { get; set; }

        public int? NumeroPiso { get; set; }
        
        public TarefaSchema(string id, string percurso, string estado, string emailRequisitor,string codDispositivo, 
                        string nomeContactoVigilancia, string numeroContactoVigilancia,
                        string codEdificio, int numeroPiso) {
            this.TipoTarefa = "Vigilancia";
            this.Id = id;
            this.PercursoString = percurso;
            this.EstadoString = estado;
            this.EmailRequisitor = emailRequisitor;
            this.CodDispositivo = codDispositivo;
            this.NomeVigilancia = nomeContactoVigilancia;
            this.NumeroVigilancia = numeroContactoVigilancia;
            this.CodEdificio = codEdificio;
            this.NumeroPiso = numeroPiso;
        }

        public TarefaSchema(string id, string percurso, string estado, string emailRequisitor, string codDispositivo,
                            string codConfirmacao, string descricaoEntrega, 
                            string nomeContactopickup, string numeroContactopickup, 
                            string nomeContactoDelivery, string numeroContactoDelivery,
                            string salaInicial, string salaFinal) {
            this.TipoTarefa = "PickUpDelivery";
            this.Id = id;
            this.EstadoString = estado;
            this.PercursoString = percurso;
            this.EmailRequisitor = emailRequisitor;
            this.CodDispositivo = codDispositivo;
            this.CodConfirmacao = codConfirmacao;
            this.DescricaoEntrega = descricaoEntrega;
            this.NomePickUp = nomeContactopickup;
            this.NumeroPickUp = numeroContactopickup;
            this.NomeDelivery = nomeContactoDelivery;
            this.NumeroDelivery = numeroContactoDelivery;
            this.SalaInicial = salaInicial;
            this.SalaFinal = salaFinal;
        }
    }
}