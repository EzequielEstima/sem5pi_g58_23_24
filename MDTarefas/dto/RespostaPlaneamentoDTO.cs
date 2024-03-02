namespace MDTarefas.dto;

public class RespostaPlaneamentoDTO
{

    public string? resultado { get; set; }
     public RespostaPlaneamentoDTO() {
    }
    public RespostaPlaneamentoDTO(string resultado) {
        this.resultado =  resultado;
    }

}