using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Accounts.Queries.GetAccount;

public class GetAccountQueryHandler : IRequestHandler<GetAccountQuery, ErrorOr<List<Account>>>
{
    private readonly IAccountsRepository _AccountsRepository;

    public GetAccountQueryHandler(IAccountsRepository AccountsRepository)
    {
        _AccountsRepository = AccountsRepository;
    }

    public async Task<ErrorOr<List<Account>>> Handle(GetAccountQuery request, CancellationToken cancellationToken)
    {
        var Account = await _AccountsRepository.ListAllAsync(cancellationToken);
        if (Account is null)
        {
            return Error.NotFound(description: "Account not found.");
        }

        return Account;
    }
}