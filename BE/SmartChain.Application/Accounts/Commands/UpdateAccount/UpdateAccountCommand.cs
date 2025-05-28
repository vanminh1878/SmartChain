using ErrorOr;
using MediatR;

namespace SmartChain.Application.Accounts.Commands.UpdateAccount;

public record UpdateAccountCommand(Guid AccountId, string Password) : IRequest<ErrorOr<Success>>;