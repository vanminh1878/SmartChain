// Application/Contracts/Auth/LoginResponse.cs
using SmartChain.Domain.User;

namespace SmartChain.Application.Auth
{
    public record LoginResponse(string Token, User User);
}