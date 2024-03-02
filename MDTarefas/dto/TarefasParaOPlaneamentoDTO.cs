namespace MDTarefas.dto;

public class TarefasParaOPlaneamentoDTO
{

    public string[]? robot { get; set; }
    public int algoritmo { get; set; }

    public TarefasParaOPlaneamentoDTO() {
    }
    public TarefasParaOPlaneamentoDTO(string[] robot, int algoritmo) {
        this.robot =  robot;
        this.algoritmo = algoritmo;
    }

}