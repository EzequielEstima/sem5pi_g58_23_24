using MDTarefas.dto;
using MDTarefas.mappers;
using MDTarefas.Models.exceptions;
using MDTarefas.Models.tarefa;
using MDTarefas.Services.IServices;
using MDTarefas.utils;

namespace MDTarefas.Services.ImplServices
{
  public class AuthService : IAuthService
    {
        public bool IsAuthenticated(HttpRequest req)
        {
            if(req.Headers.TryGetValue("Authorization", out var authHeader)){
                var token = authHeader.ToString().Split(" ")[1];
                var tokenClaim = JwtUtils.DecodeJwt(token);
                if(tokenClaim == null){
                    Console.WriteLine("Token is null");
                    return false;
                }
                try{
                    var email = tokenClaim.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress");
                    if(email == null){
                        return false;
                }
                }catch(Exception e){
                    Console.WriteLine(e.Message);
                }
                return true;
            }
            return false;
        }

        public bool IsAuthorized(HttpRequest req, string[] roles)
        {
            if(req.Headers.TryGetValue("Authorization", out var authHeader)){
                var token = authHeader.ToString().Split(" ")[1];
                var tokenClaim = JwtUtils.DecodeJwt(token);
                if(tokenClaim == null){
                    return false;
                }
                var role = tokenClaim.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role");
                if(role == null){
                    return false;
                }
                foreach(string r in roles){
                    if(r == role.Value){
                        return true;
                    }
                }
                return false;
            }
            return false;
        }

        public string? GetEmail(HttpRequest req)
        {
            if(req.Headers.TryGetValue("Authorization", out var authHeader)){
                var token = authHeader.ToString().Split(" ")[1];
                var tokenClaim = JwtUtils.DecodeJwt(token);
                if(tokenClaim == null){
                    return null;
                }
                var email = tokenClaim.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress");
                if(email == null){
                    return null;
                }
                return email.Value;
            }
            return null;
        }

        public string? GetToken(HttpRequest req)
        {
            if(req.Headers.TryGetValue("Authorization", out var authHeader)){
                return authHeader.ToString().Split(" ")[1];
            }
            return null;
        }

    }
}