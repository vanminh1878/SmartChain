using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Accounts.Queries.GetAccountByStatus;

public class GetAccountByStatusQueryHandler : IRequestHandler<GetAccountByStatusQuery, ErrorOr<List<Account>>>
{
    private readonly IAccountsRepository _AccountsRepository;

    public GetAccountByStatusQueryHandler(IAccountsRepository AccountsRepository)
    {
        _AccountsRepository = AccountsRepository;
    }

    public async Task<ErrorOr<List<Account>>> Handle(GetAccountByStatusQuery request, CancellationToken cancellationToken)
    {
        var Account = await _AccountsRepository.ListByStatusAsync(request.Status, cancellationToken);
        if (Account is null)
        {
            return Error.NotFound(description: "Account not found.");
        }

        return Account;
    }
}