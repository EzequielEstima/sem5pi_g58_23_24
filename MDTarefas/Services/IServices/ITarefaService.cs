using MDTarefas.dto;

namespace MDTarefas.Services.IServices {
    public interface ITarefaService {
        Task<List<TarefaDTO>> listarTarefas();
        Task<TarefaDTO?> listarTarefaPorId(string id);
        Task<TarefaDTO> criarTarefa(CriarTarefaDTO tarefaDTO, string token);
        Task<List<TarefaDTO>> listarTarefasPendentes();
        Task removerTarefaPorId(string id);
        Task<TarefaDTO> alterarEstadoDaTarefa(AlterarEstadoDaTarefaDTO tarefaDTO);
        Task<List<PlanearTarefasDTO>> carregarTarefasNoPlaneamento(int algoritmo);
        Task<List<TarefaDTO>> obterTarefasPorCriterio(string criterio, string valor);

        Task<string> obterPercursoTarefa(string idTarefa);
    }
}