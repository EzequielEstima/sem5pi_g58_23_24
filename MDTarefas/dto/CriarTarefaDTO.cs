namespace MDTarefas.dto;

public class CriarTarefaDTO
{
    public string TipoTarefa { get; set; } = null!; // "PickUpDelivery" or "Vigilancia"
    // For both types of Tarefa
    public string? Email { get; set; }
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

}