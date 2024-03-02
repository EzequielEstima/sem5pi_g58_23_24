using System.Text.RegularExpressions;
using MDTarefas.dataSchemas;
using MDTarefas.dto;
using MDTarefas.Models.exceptions;
using MDTarefas.Models.tarefa;
using MongoDB.Bson.Serialization.Conventions;
using SharpCompress.Archives.Tar;

namespace MDTarefas.mappers
{
    public class TarefaMapper
    {

        //DTOs
        public static TarefaDTO toDTO(Tarefa tarefa)
        {

            if (tarefa is Vigilancia)
            {

                Vigilancia vigilancia = (Vigilancia)tarefa;

                return new TarefaDTO(vigilancia.getId(),
                                    vigilancia.getPercursoString(),
                                    vigilancia.getEstadoString(),
                                    vigilancia.getEmailRequisitorString(),
                                    vigilancia.getCodDispositivo(),
                                    vigilancia.getNumeroPisoInt(),
                                    vigilancia.getCodEdificioString(),
                                    vigilancia.getContactoNomeString(),
                                    vigilancia.getContactoNumeroString());
            }
            else
            {

                PickUpDelivery pickUpDelivery = (PickUpDelivery)tarefa;

                return new TarefaDTO(pickUpDelivery.getId(),
                                    pickUpDelivery.getPercursoString(),
                                    pickUpDelivery.getEstadoString(),
                                    pickUpDelivery.getEmailRequisitorString(),
                                    pickUpDelivery.getCodDispositivo(),
                                    pickUpDelivery.getCodConfirmacaoString(),
                                    pickUpDelivery.getDescricaoEntregaString(),
                                    pickUpDelivery.getNomeContactoPickUpString(),
                                    pickUpDelivery.getNumeroContactoPickUpString(),
                                    pickUpDelivery.getNomeContactoDeliveryString(),
                                    pickUpDelivery.getNumeroContactoDeliveryString(),
                                    pickUpDelivery.getNomeSalaInicialString(),
                                    pickUpDelivery.getNomeSalaFinalString());
            }
        }

        //SCHEMAS

        public static TarefaSchema toPersistance(Tarefa tarefa)
        {

            if (tarefa is Vigilancia)
            {

                Vigilancia vigilancia = (Vigilancia)tarefa;

                return new TarefaSchema(vigilancia.getId(),
                                    vigilancia.getPercursoString(),
                                    vigilancia.getEstadoString(),
                                    vigilancia.getEmailRequisitorString(),
                                    vigilancia.getCodDispositivo(),
                                    vigilancia.getContactoNomeString(),
                                    vigilancia.getContactoNumeroString(),
                                    vigilancia.getCodEdificioString(),
                                    vigilancia.getNumeroPisoInt());
            }
            else
            {

                PickUpDelivery pickUpDelivery = (PickUpDelivery)tarefa;

                return new TarefaSchema(pickUpDelivery.getId(),
                                    pickUpDelivery.getPercursoString(),
                                    pickUpDelivery.getEstadoString(),
                                    pickUpDelivery.getEmailRequisitorString(),
                                    pickUpDelivery.getCodDispositivo(),
                                    pickUpDelivery.getCodConfirmacaoString(),
                                    pickUpDelivery.getDescricaoEntregaString(),
                                    pickUpDelivery.getNomeContactoPickUpString(),
                                    pickUpDelivery.getNumeroContactoPickUpString(),
                                    pickUpDelivery.getNomeContactoDeliveryString(),
                                    pickUpDelivery.getNumeroContactoDeliveryString(),
                                    pickUpDelivery.getNomeSalaInicialString(),
                                    pickUpDelivery.getNomeSalaFinalString());
            }
        }

        public static Tarefa toDomain(TarefaSchema tarefaSchema)
        {

            if (tarefaSchema.TipoTarefa.Equals("Vigilancia")
                && tarefaSchema.NomeVigilancia != null && tarefaSchema.NumeroVigilancia != null
                && tarefaSchema.CodEdificio != null && tarefaSchema.NumeroPiso != null && tarefaSchema.CodDispositivo != null)
            {

                return new Vigilancia(tarefaSchema.NomeVigilancia,
                                    tarefaSchema.NumeroVigilancia,
                                    tarefaSchema.CodEdificio,
                                    tarefaSchema.NumeroPiso ?? 0,
                                    tarefaSchema.PercursoString,
                                    tarefaSchema.EmailRequisitor,
                                    tarefaSchema.Id,
                                    tarefaSchema.CodDispositivo,
                                    tarefaSchema.EstadoString);

            }
            else if (tarefaSchema.TipoTarefa.Equals("PickUpDelivery")
                        && tarefaSchema.CodConfirmacao != null && tarefaSchema.DescricaoEntrega != null
                        && tarefaSchema.NomePickUp != null && tarefaSchema.NumeroPickUp != null
                        && tarefaSchema.NomeDelivery != null && tarefaSchema.NumeroDelivery != null
                        && tarefaSchema.SalaInicial != null && tarefaSchema.SalaFinal != null && tarefaSchema.CodDispositivo != null)
            {

                return new PickUpDelivery(tarefaSchema.CodConfirmacao,
                                    tarefaSchema.DescricaoEntrega,
                                    tarefaSchema.NumeroPickUp,
                                    tarefaSchema.NomePickUp,
                                    tarefaSchema.NumeroDelivery,
                                    tarefaSchema.NomeDelivery,
                                    tarefaSchema.SalaInicial,
                                    tarefaSchema.SalaFinal,
                                    tarefaSchema.PercursoString,
                                    tarefaSchema.EmailRequisitor,
                                    tarefaSchema.Id,
                                    tarefaSchema.CodDispositivo,
                                    tarefaSchema.EstadoString);
            }

            throw new ArgumentException("Invalid TarefaSchema");
        }

        public static TarefasParaOPlaneamentoDTO toTarefasParaOPlaneamentoDTO(List<Tarefa> list, int algoritmo)
        {
            string percurso;
            string dispositivo;
            string tarefaNome;

            var resposta = new List<string>();
            var robots = new Dictionary<string, List<string>>();

            string tarefaParaOPlaneamento;

            foreach (Tarefa tarefa in list)
            {
                if (tarefa.getCodDispositivo() != null)
                {
                    dispositivo = "\'"+tarefa.getCodDispositivo()+"\'";
                    tarefaNome = tarefa.getId();
                    percurso = tarefa.getPercursoString();
                    Regex regex = new Regex(@"celPiso\(\w+,\d+,\d+\)");
                    MatchCollection coincidencias = regex.Matches(percurso);

                    if (coincidencias.Count != 0)
                    {
                        string primeiraCelula = coincidencias[0].Value;
                        string ultimaCelula = coincidencias[coincidencias.Count - 1].Value;

                        // Encontrando el índice del primer paréntesis abierto y el paréntesis cerrado
                        int startIndex = primeiraCelula.IndexOf('(') + 1;
                        int endIndex = primeiraCelula.IndexOf(')');

                        // Extrayendo la subcadena entre paréntesis
                        string trimmedInput = primeiraCelula.Substring(startIndex, (endIndex - startIndex));

                        // Dividiendo la cadena basada en comas
                        string[] parts = trimmedInput.Split(',');

                        // Asignando los valores a las variables
                        string primeiroPiso = parts[0];
                        string primeiroX = parts[1];
                        string primeiroY = parts[2];

                        // Encontrando el índice del primer paréntesis abierto y el paréntesis cerrado
                        startIndex = ultimaCelula.IndexOf('(') + 1;
                        endIndex = ultimaCelula.IndexOf(')');

                        // Extrayendo la subcadena entre paréntesis
                        trimmedInput = ultimaCelula.Substring(startIndex, (endIndex - startIndex) );

                        // Dividiendo la cadena basada en comas
                        parts = trimmedInput.Split(',');

                        // Asignando los valores a las variables
                        string ultimoPiso = parts[0];
                        string ultimoX = parts[1];
                        string ultimoY = parts[2];
                        
                        string tarefaString = "tarefa(" +"\'"+tarefaNome+"\'"+ "," + primeiroX + "," + primeiroY + "," + 
                        primeiroPiso +  "," + ultimoX + "," + ultimoY + "," + ultimoPiso+ ")";

                        if (robots.ContainsKey(dispositivo))
                        {
                            robots[dispositivo].Add(tarefaString);
                        }
                        else
                        {
                            robots.Add(dispositivo, []);
                            robots[dispositivo].Add(tarefaString);
                        }
                    }
                }
            }

            foreach (KeyValuePair<string, List<string>> robot in robots)
            {
                string listAsString = "[" + String.Join(",", robot.Value) + "]";
                tarefaParaOPlaneamento = "robot(" + robot.Key + "," + listAsString + ")";
                resposta.Add(tarefaParaOPlaneamento);
            }

            return new TarefasParaOPlaneamentoDTO([.. resposta], algoritmo);

        }

        public static RespostaMDTarefaPlaneamentoDTO toArrayDTO(string? resultado)
        {
            if (resultado == null)
            {
                throw new BusinessRuleValidationException("Não foi obtido nenhum resultado do planeamento");
            }
            List<string> tarefasParaOPlaneamento = new List<string>();; 
            Regex regex = new Regex(@"robot\(([^()]*\([^)]*\))*[^()]*\)");
            MatchCollection coincidencias = regex.Matches(resultado);
            if (coincidencias.Count != 0)
            {
                foreach (Match coincidencia in coincidencias)
                {
                    string robot = coincidencia.Value;
                    tarefasParaOPlaneamento.Add(robot);
                }
                return new RespostaMDTarefaPlaneamentoDTO(tarefasParaOPlaneamento);
            }
            else
            {
                throw new BusinessRuleValidationException("Não foi possível transformar o resultado do planeamento em um array de tarefas");
            }
        }

        public static PlanearTarefasDTO toPlanearTarefasDTO(string codDispositivo, List<Tarefa> tarefas)
        {
            List<string> tarefasString = new List<string>();
            foreach (Tarefa tarefa in tarefas)
            {   
                if (tarefa is Vigilancia)
                {
                    

                    Vigilancia vigilancia = (Vigilancia)tarefa;
                    tarefasString.Add("Vigilancia---"+tarefa.getId()+"---"+tarefa.getEmailRequisitorString()+"---"+vigilancia.getCodEdificioString()+"---"+vigilancia.getNumeroPisoInt());
                }
                else
                {

                    PickUpDelivery pickUpDelivery = (PickUpDelivery)tarefa;
                    tarefasString.Add("PickUpDelivery---"+tarefa.getId()+"---"+tarefa.getEmailRequisitorString()+"---"+pickUpDelivery.getNomeSalaInicialString()+"---"+pickUpDelivery.getNomeSalaFinalString());
                }
                
            }
            return new PlanearTarefasDTO(codDispositivo, tarefasString);
            
        }
    }
}