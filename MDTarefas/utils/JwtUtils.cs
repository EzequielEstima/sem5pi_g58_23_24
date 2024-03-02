using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MDTarefas.utils
{
    public class JwtUtils
    {

        public static ClaimsPrincipal DecodeJwt(string jwtToken)
        {
            string secretKey = "my sakdfho2390asjod$%jl)!sdjas0i secret";

            var handler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters{
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ValidateIssuer = false,
                ValidateAudience = false
            };

            try{
                var principal = handler.ValidateToken(jwtToken, validationParameters, out _);
                return principal;
            }catch (SecurityTokenException ex){
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return null;
            }
        }
    }
}
