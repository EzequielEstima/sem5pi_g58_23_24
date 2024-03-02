using MDTarefas.dto;
using MDTarefas.mappers;
using MDTarefas.Models.exceptions;
using MDTarefas.Models.tarefa;
using MDTarefas.services.IRepos;
using MDTarefas.Services.IServices;
using MDTarefas.utils;
using MDTarefas.dataSchemas;
using System.Text.Json;
using System.Text;
using System.Net.Http.Headers;
using Microsoft.Extensions.Options;
using System.Text.RegularExpressions;

namespace MDTarefas.Services.ImplServices
{
  public class TarefaService : ITarefaService
    {
        private readonly ITarefaRepo _tarefaRepository;
        private readonly HttpClient httpClient;

        public TarefaService(ITarefaRepo tarefaRepository, HttpClient httpClient)
        {
            this._tarefaRepository = tarefaRepository;
            this.httpClient = httpClient;
        }

        public async Task<List<TarefaDTO>> listarTarefas() {
            List<Tarefa> list =  await _tarefaRepository.GetAsync();
            List<TarefaDTO> listDTO = new List<TarefaDTO>();
            foreach (Tarefa tarefa in list) {
                listDTO.Add(TarefaMapper.toDTO(tarefa));
            }
            return listDTO;
        }

        public async Task<TarefaDTO?> listarTarefaPorId(string id) {
            var tarefa = await _tarefaRepository.GetAsync(id);
            if (tarefa == null) {
                return null;
            }
            return TarefaMapper.toDTO(tarefa);
        }

        public async Task<TarefaDTO> criarTarefa(CriarTarefaDTO tarefaDTO, string jwtToken) {
            this.httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {jwtToken}");
            if (tarefaDTO.TipoTarefa.ToLower() == "pickupdelivery") {
                var tarefa = await criarPickUpDelivery(tarefaDTO);
                return TarefaMapper.toDTO(tarefa);
            } else if (tarefaDTO.TipoTarefa.ToLower() == "vigilancia") {
                var tarefa = await criarVigilancia(tarefaDTO);
                return TarefaMapper.toDTO(tarefa);
            } else {
                throw new BusinessRuleValidationException("Tipo de tarefa inválido");
            }
        }

        private async Task<Tarefa> criarPickUpDelivery(CriarTarefaDTO tarefaDTO){
            if (tarefaDTO.CodConfirmacao == null || tarefaDTO.DescricaoEntrega == null ||
                tarefaDTO.NomePickUp == null || tarefaDTO.NumeroPickUp == null ||
                tarefaDTO.NomeDelivery == null || tarefaDTO.NumeroDelivery == null ||
                tarefaDTO.SalaInicial == null || tarefaDTO.SalaFinal == null ||
                tarefaDTO.Email == null) {
                throw new BusinessRuleValidationException("Tarefa de pick up and delivery necessita de um código de confirmação, descrição de entrega, contactos (nome e nº de telefone) de pick up e delivery, sala inicial e sala final");
            }

            string id = RandomHexStringGenerator.GenerateRandomHex(24);

            string percurso = await obterPercursoEntreSalas(tarefaDTO.SalaInicial, tarefaDTO.SalaFinal);
            percurso = percurso.Trim('\"');
            

            PickUpDelivery tarefa = new PickUpDelivery(
                tarefaDTO.CodConfirmacao,
                tarefaDTO.DescricaoEntrega,
                tarefaDTO.NumeroPickUp,
                tarefaDTO.NomePickUp,
                tarefaDTO.NumeroDelivery,
                tarefaDTO.NomeDelivery,
                tarefaDTO.SalaInicial,
                tarefaDTO.SalaFinal,
                percurso,
                tarefaDTO.Email,
                id,
                "" // CodDispositivo só é atualizado quando a tarefa é aceite
            );

            await _tarefaRepository.CreateAsync(tarefa);
            return tarefa;
        }

        private async Task<Tarefa> criarVigilancia(CriarTarefaDTO tarefaDTO){
            if (tarefaDTO.NomeVigilancia == null || tarefaDTO.NumeroVigilancia == null ||
                tarefaDTO.CodEdificio == null || tarefaDTO.NumeroPiso == null ||
                tarefaDTO.Email == null) {
                throw new BusinessRuleValidationException("Tarefa de vigilância necessita de um contacto (nome e nº de telefone), código de edifício e número de piso");
            }

            string id = RandomHexStringGenerator.GenerateRandomHex(24);

            string percurso = await obterPercursoVigilancia(tarefaDTO.CodEdificio, tarefaDTO.NumeroPiso ?? 1);
            percurso = percurso.Trim('\"');

            Vigilancia tarefa = new Vigilancia(
                tarefaDTO.NomeVigilancia,
                tarefaDTO.NumeroVigilancia,
                tarefaDTO.CodEdificio,
                tarefaDTO.NumeroPiso ?? 0, // Se null então 0 (nunca vai ser null, mas o compilador não sabe disso)
                percurso,
                tarefaDTO.Email,
                id,
                "" // CodDispositivo só é atualizado quando a tarefa é aceite
            );

            await _tarefaRepository.CreateAsync(tarefa);
            return tarefa;
        }

        private async Task<string> obterPercursoEntreSalas(string salaInicial, string salaFinal) {
            
            string baseUri = utils.Environments.MDRI_API_PLANEAMENTO_URL + "/caminhoEntreEdificios";
            string finalUrl = $"{baseUri}?salaInicial={salaInicial}&salaFinal={salaFinal}";

            HttpResponseMessage response = await this.httpClient.GetAsync(finalUrl);

            if (response.IsSuccessStatusCode) {
                return await response.Content.ReadAsStringAsync();
            } else {
                string errorMessage = await response.Content.ReadAsStringAsync();
                throw new BusinessRuleValidationException($"Pedido ao módulo de planeamento falhou.\nErro: {errorMessage}");
            }
            
        }

        private async Task<string> obterPercursoVigilancia(string codigoEd, int numeroPiso) {
            
            string baseUri = utils.Environments.MDRI_API_PLANEAMENTO_URL + "/caminhoVigilancia";
            string finalUrl = $"{baseUri}?codigoEd={codigoEd}&numeroPiso={numeroPiso}";

            HttpResponseMessage response = await this.httpClient.GetAsync(finalUrl);

            if (response.IsSuccessStatusCode) {
                return await response.Content.ReadAsStringAsync();
            } else {
                string errorMessage = await response.Content.ReadAsStringAsync();
                throw new BusinessRuleValidationException($"Pedido ao módulo de planeamento falhou.\nErro: {errorMessage}");
            }
            
        }

        public async Task<List<TarefaDTO>> listarTarefasPendentes() {
            List<Tarefa> list =  await _tarefaRepository.GetTarefasPendentesAsync();
            List<TarefaDTO> listDTO = new List<TarefaDTO>();
            foreach (Tarefa tarefa in list) {
                listDTO.Add(TarefaMapper.toDTO(tarefa));
            }
            return listDTO;
        }

        public async Task removerTarefaPorId(string id){
            if (!await _tarefaRepository.RemoveAsync(id)) {
                throw new NotFoundException("Tarefa não existe");
            }
        }

        public async Task<TarefaDTO> alterarEstadoDaTarefa(AlterarEstadoDaTarefaDTO tarefaDTO) { 
            if (tarefaDTO.Id == null || tarefaDTO.Estado == null) {
                throw new BusinessRuleValidationException("Id e estado da tarefa são obrigatórios");
            }
            Tarefa tarefa = await _tarefaRepository.GetAsync(tarefaDTO.Id);
            if (tarefa == null) {
                throw new NotFoundException("Tarefa não existe");
            }
            tarefa.updateEstado(tarefaDTO.Estado);
            if (tarefa.getEstadoString() == "Aceite") {
                if (tarefaDTO.CodigoRobo != null) {
                    tarefa.updateCodigoRobo(tarefaDTO.CodigoRobo);
                }else{
                    throw new BusinessRuleValidationException("Código do robô é obrigatório caso a tarefa seja aceite");
                }
            }
            
            
            await _tarefaRepository.UpdateAsync(tarefaDTO.Id, tarefa);
            return TarefaMapper.toDTO(tarefa);
        }

    
        public async Task<List<PlanearTarefasDTO>> carregarTarefasNoPlaneamento(int algoritmo) {
            if (algoritmo < 0 || algoritmo > 2) {
                throw new BusinessRuleValidationException("Algoritmo inválido");
            }
            List<Tarefa> list =  await _tarefaRepository.GetTarefasAceitesAsync();
            if (list.Count == 0) {
                throw new NotFoundException("Não existem tarefas aceites");
            }
            var response = await comunicacaoComPlaneamentoAsync(TarefaMapper.toTarefasParaOPlaneamentoDTO(list,algoritmo));
            
            
            if (response.resultado == null)
            {
                throw new BusinessRuleValidationException("Não foi obtido nenhum resultado do planeamento");
            }
            
            List<PlanearTarefasDTO> resposta = new List<PlanearTarefasDTO>();
                        
            Regex regex = new Regex(@"robot\((\w+),\[([^\]]+)\]\)");
            MatchCollection coincidencias = regex.Matches(response.resultado);
            List<Tarefa> totalDeTarefas = new List<Tarefa>();

            coincidencias.Count.ToString();
            if (coincidencias.Count != 0)
            {
                foreach (Match coincidencia in coincidencias)
                {   
                    var codDispositivo = coincidencia.Groups[1].Value;

                    List<Tarefa> tarefas = new List<Tarefa>();
                    Regex regexTarefas = new Regex(@"tarefa\(([^,]+),");

                    MatchCollection coincidenciasTarefas = regexTarefas.Matches(coincidencia.Groups[2].Value);
                    foreach (Match match in coincidenciasTarefas)
                        {
                            string id = match.Groups[1].Value; // Extract the 24-letter ID part
                            Tarefa tarefa = await _tarefaRepository.GetAsync(id);
                            tarefas.Add(tarefa);
                            totalDeTarefas.Add(tarefa);
                        }
                    resposta.Add(TarefaMapper.toPlanearTarefasDTO(codDispositivo,tarefas));
                }
                foreach (Tarefa tarefa in totalDeTarefas)
                {
                    tarefa.updateEstado("Planeada");
                    await _tarefaRepository.UpdateAsync(tarefa.getId(), tarefa);
                }
                return resposta;
            }
            else
            {
                throw new BusinessRuleValidationException("Não foi possível transformar o resultado do planeamento para o formato certo");
            }
            return resposta;
        }

        public async Task<RespostaPlaneamentoDTO> comunicacaoComPlaneamentoAsync(TarefasParaOPlaneamentoDTO list) {
            string baseUri = utils.Environments.PLANEAMENTO_API_URL + "/tarefa/tempo";
            HttpContent content = new StringContent(JsonSerializer.Serialize(list), Encoding.UTF8, "application/json");

            HttpResponseMessage response = await this.httpClient.PostAsync(baseUri,  content);

            if (!response.IsSuccessStatusCode) {
                string errorMessage = await response.Content.ReadAsStringAsync();
                throw new BusinessRuleValidationException($"Pedido ao módulo de planeamento falhou.\nErro: {errorMessage}");
            }
            else{
                var conteudo = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<RespostaPlaneamentoDTO>(conteudo);
            }

        }

        public async Task<List<TarefaDTO>> obterTarefasPorCriterio(string criterio, string valor) {
            if (criterio.isNullEmptyOrBlank()) {
                throw new BusinessRuleValidationException("Criterio é obrigatório");
            }
            List<Tarefa> list = new List<Tarefa>();
            if (criterio == "estado") {
                list = await _tarefaRepository.GetTarefasByEstado(valor); 
            }
            else if (criterio == "tipo") {
                list = await _tarefaRepository.GetTarefasByTipo(valor);
            }
            else if (criterio == "utente"){
                list = await _tarefaRepository.GetTarefasByUtente(valor);
            }
            else {
                throw new BusinessRuleValidationException("Criterio inválido");
            }
            
            if (list.Count == 0) {
                throw new NotFoundException("Não existem tarefas com esse critério");
            }

            List<TarefaDTO> listDTO = new List<TarefaDTO>();
            foreach (Tarefa tarefa in list) {
                listDTO.Add(TarefaMapper.toDTO(tarefa));
            }
            return listDTO;
        }
        public async Task<string> obterPercursoTarefa (string idTarefa) {
            if(idTarefa.isNullEmptyOrBlank()){
                throw new BusinessRuleValidationException("Id da tarefa é obrigatório");
            }
            var tarefa = await _tarefaRepository.GetAsync(idTarefa);
            if (tarefa == null) {
                throw new NotFoundException("Tarefa não existe");
            }else if(tarefa.getPercursoString().isNullEmptyOrBlank()){
                throw new BusinessRuleValidationException("Tarefa ainda não foi planeada");
            }else{
                return tarefa.getPercursoString();
            }
        }
    }
} 
