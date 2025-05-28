using ErrorOr;
using MediatR;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Accounts.Commands.CreateAccount;

public record CreateAccountCommand(string Username, string Password) : IRequest<ErrorOr<Account>>;