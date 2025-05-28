using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Accounts.Commands.UpdateAccount;

public class UpdateAccountCommandHandler : IRequestHandler<UpdateAccountCommand, ErrorOr<Success>>
{
    private readonly IAccountsRepository _AccountsRepository;

    public UpdateAccountCommandHandler(IAccountsRepository accountsRepository)
    {
        _AccountsRepository = accountsRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
    {
        var Account = await _AccountsRepository.GetByIdAsync(request.AccountId, cancellationToken);
        if (Account is null)
        {
            return Error.NotFound(description: "Account not found.");
        }

        var result = Account.UpdatePassword(request.Password);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _AccountsRepository.UpdateAsync(Account, cancellationToken);
        return Result.Success;
    }
}