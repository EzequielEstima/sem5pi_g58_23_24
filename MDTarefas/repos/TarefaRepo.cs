using MDTarefas.dataSchemas;
using MDTarefas.mappers;
using MDTarefas.Models;
using MDTarefas.Models.tarefa;
using MDTarefas.services.IRepos;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace MDTarefas.repos;

public class TarefaRepo : ITarefaRepo
{
    private readonly IMongoCollection<TarefaSchema> _tarefaCollection;

    public TarefaRepo() {}

    public TarefaRepo(
        IOptions<TarefaDatabaseSettings> tarefaDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            tarefaDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            tarefaDatabaseSettings.Value.DatabaseName);

        _tarefaCollection = mongoDatabase.GetCollection<TarefaSchema>(
            tarefaDatabaseSettings.Value.TarefaCollectionName);
    }

    public async Task<List<Tarefa>> GetAsync() {
        List<TarefaSchema> schemaList = await _tarefaCollection.Find(_ => true).ToListAsync();
        List<Tarefa> entityList = new List<Tarefa>();
        foreach (TarefaSchema tarefa in schemaList) {
            entityList.Add(TarefaMapper.toDomain(tarefa));
        }
        return entityList;
    }

    public async Task<List<Tarefa>> GetTarefasPendentesAsync() {
    List<TarefaSchema> schemaList = await _tarefaCollection.Find(x => x.EstadoString == "Pendente").ToListAsync();
    List<Tarefa> entityList = new List<Tarefa>();
    foreach (TarefaSchema tarefa in schemaList) {
        entityList.Add(TarefaMapper.toDomain(tarefa));
    }
    return entityList;
}

       public async Task<List<Tarefa>> GetTarefasAceitesAsync()
    {
        List<TarefaSchema> schemaList = await _tarefaCollection.Find(x => x.EstadoString == "Aceite").ToListAsync();
        List<Tarefa> entityList = new List<Tarefa>();
        foreach (TarefaSchema tarefa in schemaList)
        {
            entityList.Add(TarefaMapper.toDomain(tarefa));
        }
        return entityList;
    }

    public async Task<Tarefa?> GetAsync(string id)
    {
        TarefaSchema schema = await _tarefaCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        if (schema == null) {
            return null;
        }
        return TarefaMapper.toDomain(schema);
    }

    public async Task<Tarefa> CreateAsync(Tarefa newTarefa) {
        await _tarefaCollection.InsertOneAsync(TarefaMapper.toPersistance(newTarefa));
        return newTarefa;
    }

    public async Task UpdateAsync(string id, Tarefa updatedTarefa)   {
        await _tarefaCollection.ReplaceOneAsync(x => x.Id == id, TarefaMapper.toPersistance(updatedTarefa));
    }

    public async Task<bool> RemoveAsync(string id){
        var result = await _tarefaCollection.DeleteOneAsync(x => x.Id == id);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }

       public async Task<List<Tarefa>> GetTarefasByEstado(string valor) {
        List<TarefaSchema> schemaList = await _tarefaCollection.Find(x => x.EstadoString == valor).ToListAsync();
        List<Tarefa> entityList = new List<Tarefa>();
        foreach (TarefaSchema tarefa in schemaList) {
            entityList.Add(TarefaMapper.toDomain(tarefa));
        }
        return entityList;
    }

    public async Task<List<Tarefa>> GetTarefasByTipo(string valor){
        List<TarefaSchema> schemaList = await _tarefaCollection.Find(x => x.TipoTarefa == valor).ToListAsync();
        List<Tarefa> entityList = new List<Tarefa>();
        foreach (TarefaSchema tarefa in schemaList) {
            entityList.Add(TarefaMapper.toDomain(tarefa));
        }
        return entityList;
    }

    public async Task<List<Tarefa>> GetTarefasByUtente(string valor){
        List<TarefaSchema> schemaList = await _tarefaCollection.Find(x => x.EmailRequisitor == valor).ToListAsync();
        List<Tarefa> entityList = new List<Tarefa>();
        foreach (TarefaSchema tarefa in schemaList) {
            entityList.Add(TarefaMapper.toDomain(tarefa));
        }
        return entityList;
    }

}