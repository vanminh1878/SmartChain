using ErrorOr;
using MediatR;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Auth.Commands
{
    public record UpdatePasswordCommand(string Username, string NewPassword) : IRequest<ErrorOr<Account>>;
}