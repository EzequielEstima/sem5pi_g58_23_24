using MDTarefas.dto;

namespace MDTarefas.Services.IServices {
    public interface IAuthService {
        bool IsAuthenticated(HttpRequest req);
        bool IsAuthorized(HttpRequest req, string[] roles);
        string? GetEmail(HttpRequest req);
        string? GetToken(HttpRequest req);
    }
}