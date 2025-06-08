// Application/Auth/Queries/LoginQuery.cs
using ErrorOr;
using MediatR;
using SmartChain.Application.Auth;

namespace SmartChain.Application.Auth.Queries
{
    public record LoginQuery(string Username, string Password) : IRequest<ErrorOr<LoginResponse>>;
}