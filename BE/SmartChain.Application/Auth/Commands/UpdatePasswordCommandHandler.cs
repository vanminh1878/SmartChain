using ErrorOr;
using MediatR;
using SmartChain.Domain.Account;
using SmartChain.Application.Common.Interfaces; // Giả định bạn có repository

namespace SmartChain.Application.Auth.Commands
{
    public class UpdatePasswordCommandHandler : IRequestHandler<UpdatePasswordCommand, ErrorOr<Account>>
    {
        private readonly IAccountsRepository _accountRepository;

        public UpdatePasswordCommandHandler(IAccountsRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<ErrorOr<Account>> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
        {
            var account = await _accountRepository.GetByUsernameAsync(request.Username, cancellationToken);
            if (account == null)
            {
                return Error.NotFound("Account not found.");
            }

            var result = account.UpdatePassword(request.NewPassword);
            if (result.IsError)
            {
                return result.Errors;
            }

            await _accountRepository.UpdateAsync(account, cancellationToken);
            return account;
        }
    }
}