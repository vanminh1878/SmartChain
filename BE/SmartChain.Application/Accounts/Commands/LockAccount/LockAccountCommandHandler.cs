using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Accounts.Commands.LockAccount;

public class LockAccountCommandHandler : IRequestHandler<LockAccountCommand, ErrorOr<Success>>
{
    private readonly IAccountsRepository _AccountsRepository;

    public LockAccountCommandHandler(IAccountsRepository AccountsRepository)
    {
        _AccountsRepository = AccountsRepository;
    }

    public async Task<ErrorOr<Success>> Handle(LockAccountCommand request, CancellationToken cancellationToken)
    {
        var Account = await _AccountsRepository.GetByIdAsync(request.AccountId, cancellationToken);
        if (Account is null)
        {
            return Error.NotFound(description: "Account not found.");
        }

        var result = Account.UpdateStatus();
        if (result.IsError)
        {
            return result.Errors;
        }

        await _AccountsRepository.UpdateAsync(Account, cancellationToken);
        return Result.Success;
    }
}