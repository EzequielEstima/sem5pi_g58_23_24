namespace MDTarefas.dto
{
    public class RespostaMDTarefaPlaneamentoDTO
    {

        public List<string>? robots { get; set; }
        public RespostaMDTarefaPlaneamentoDTO() {
        }
        public RespostaMDTarefaPlaneamentoDTO(List<string> robots) {
            this.robots = robots;
        }

    }
}