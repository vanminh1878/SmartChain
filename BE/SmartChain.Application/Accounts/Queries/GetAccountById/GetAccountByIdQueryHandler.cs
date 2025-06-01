using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Accounts.Queries.GetAccountById;

public class GetAccountByIdQueryHandler : IRequestHandler<GetAccountByIdQuery, ErrorOr<Account>>
{
    private readonly IAccountsRepository _AccountsRepository;

    public GetAccountByIdQueryHandler(IAccountsRepository AccountsRepository)
    {
        _AccountsRepository = AccountsRepository;
    }

    public async Task<ErrorOr<Account>> Handle(GetAccountByIdQuery request, CancellationToken cancellationToken)
    {
        var Account = await _AccountsRepository.GetByIdAsync(request.Id, cancellationToken);
        if (Account is null)
        {
            return Error.NotFound(description: "Account not found.");
        }

        return Account;
    }
}