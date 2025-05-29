using ErrorOr;
using MediatR;

namespace SmartChain.Application.Accounts.Commands.LockAccount;

public record LockAccountCommand(Guid AccountId) : IRequest<ErrorOr<Success>>;