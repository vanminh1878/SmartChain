using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Accounts.Queries.GetAccountByUserId;

public class GetAccountByUserIdQueryHandler : IRequestHandler<GetAccountByUserIdQuery, ErrorOr<Account>>
{
    private readonly IAccountsRepository _AccountsRepository;
    private readonly IUsersRepository _UsersRepository;

    public GetAccountByUserIdQueryHandler(IAccountsRepository AccountsRepository, IUsersRepository UsersRepository)
    {
        _AccountsRepository = AccountsRepository;
        _UsersRepository = UsersRepository;
    }

    public async Task<ErrorOr<Account>> Handle(GetAccountByUserIdQuery request, CancellationToken cancellationToken)
    {
        var Account = await _UsersRepository.GetAccountByUserIdAsync(request.UserId, cancellationToken);
        if (Account is null)
        {
            return Error.NotFound(description: "Account not found.");
        }

        return Account;
    }
}