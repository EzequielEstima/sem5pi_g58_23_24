namespace MDTarefas.dto;

public class PlanearTarefasDTO
{
    public string codDispositivo { get; set; }
    public List<string> tarefas { get; set; }

   public PlanearTarefasDTO(string codDispositivo, List<string> tarefas) {
        this.codDispositivo = codDispositivo;
        this.tarefas = tarefas;
        
    }

}
