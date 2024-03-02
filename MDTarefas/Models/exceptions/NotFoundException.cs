namespace MDTarefas.Models.exceptions
{
    public class NotFoundException : Exception
    {
        public string? Details { get; }

        public NotFoundException(string message) : base(message)
        {
            
        }

        public NotFoundException(string message, string details) : base(message)
        {
            this.Details = details;
        }
    }
}