using System.Reflection.Metadata;
using System.Runtime.ConstrainedExecution;

namespace MDTarefas.utils
{
    public static class Environments{
        public const string MDRI_API_URL = "http://localhost:4000/api";

        public const string MDRI_API_PLANEAMENTO_URL = MDRI_API_URL + "/planeamento";  

        public const string  PLANEAMENTO_API_URL = "http://10.9.11.58:8000";
    }
}