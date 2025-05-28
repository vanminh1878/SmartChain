using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Accounts.Commands.CreateAccount;

public class CreateAccountCommandHandler : IRequestHandler<CreateAccountCommand, ErrorOr<Account>>
{
    private readonly IAccountsRepository _accountsRepository;

    public CreateAccountCommandHandler(IAccountsRepository accountsRepository)
    {
        _accountsRepository = accountsRepository;
    }

    public async Task<ErrorOr<Account>> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var account = new Account(request.Username, request.Password);
            await _accountsRepository.AddAsync(account, cancellationToken);
            return account;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}