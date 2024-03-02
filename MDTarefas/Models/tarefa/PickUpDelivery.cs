using MDTarefas.Models.tarefa.ValueObjects;

namespace MDTarefas.Models.tarefa
{
    public class PickUpDelivery : Tarefa
    {
        private CodConfirmacao CodConfirmacao = null!;
        private DescricaoEntrega DescricaoEntrega  = null!;
        private Contacto ContactoPickUp  = null!;
        private Contacto ContactoDelivery  = null!;
        private NomeSala SalaInicial = null!;
        private NomeSala SalaFinal = null!;
        

        public PickUpDelivery(string codConfirmacao, string descricaoEntrega, 
                            string numeroPickUp, string nomePickUp, 
                            string numeroDelivery, string nomeDelivery,
                            string salaInicial, string salaFinal,
                            string percurso, string email, string id, string codDispositivo ) : base(id, percurso, email, codDispositivo) {
            
            this.CodConfirmacao = new CodConfirmacao(codConfirmacao);
            this.DescricaoEntrega = new DescricaoEntrega(descricaoEntrega);
            this.ContactoPickUp = new Contacto(new Nome(nomePickUp), new NumeroTelefone(numeroPickUp));
            this.ContactoDelivery = new Contacto(new Nome(nomeDelivery), new NumeroTelefone(numeroDelivery));
            this.SalaInicial = new NomeSala(salaInicial);
            this.SalaFinal = new NomeSala(salaFinal);
        }
        //FOR PERSISTANCE
        public PickUpDelivery(string codConfirmacao, string descricaoEntrega, 
                            string numeroPickUp, string nomePickUp, 
                            string numeroDelivery, string nomeDelivery,
                            string salaInicial, string salaFinal,
                            string percurso, string email, string id, string codDispositivo, string estado ) : base(id, percurso, email, codDispositivo, estado) {
            
            this.CodConfirmacao = new CodConfirmacao(codConfirmacao);
            this.DescricaoEntrega = new DescricaoEntrega(descricaoEntrega);
            this.ContactoPickUp = new Contacto(new Nome(nomePickUp), new NumeroTelefone(numeroPickUp));
            this.ContactoDelivery = new Contacto(new Nome(nomeDelivery), new NumeroTelefone(numeroDelivery));
            this.SalaInicial = new NomeSala(salaInicial);
            this.SalaFinal = new NomeSala(salaFinal);
        }

        public string getCodConfirmacaoString() {
            return this.CodConfirmacao.getCodConfirmacaoString();
        }

        public string getDescricaoEntregaString() {
            return this.DescricaoEntrega.getDescricaoEntregaString();
        }

        public string getNomeContactoPickUpString() {
            return this.ContactoPickUp.getNomeString();
        }

        public string getNumeroContactoPickUpString() {
            return this.ContactoPickUp.getNumeroTelefoneString();
        }

        public string getNomeContactoDeliveryString() {
            return this.ContactoDelivery.getNomeString();
        }

        public string getNumeroContactoDeliveryString() {
            return this.ContactoDelivery.getNumeroTelefoneString();
        }

        public string getNomeSalaInicialString() {
            return this.SalaInicial.getNomeSalaString();
        }

        public string getNomeSalaFinalString() {
            return this.SalaFinal.getNomeSalaString();
        }
    }
}