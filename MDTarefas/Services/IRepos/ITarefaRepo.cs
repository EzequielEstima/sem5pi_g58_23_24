using MDTarefas.Models.tarefa;

namespace MDTarefas.services.IRepos{

    public interface ITarefaRepo{

        Task<List<Tarefa>> GetAsync();
        Task<Tarefa?> GetAsync(string id);
        Task<List<Tarefa>> GetTarefasPendentesAsync();
        Task<List<Tarefa>> GetTarefasAceitesAsync();
        Task<Tarefa> CreateAsync(Tarefa newTarefa);
        Task UpdateAsync(string id, Tarefa updatedTarefa);
        Task<bool> RemoveAsync(string id);
        Task<List<Tarefa>> GetTarefasByEstado(string valor);
        Task<List<Tarefa>> GetTarefasByTipo(string valor);
        Task<List<Tarefa>> GetTarefasByUtente(string valor);
    }

}