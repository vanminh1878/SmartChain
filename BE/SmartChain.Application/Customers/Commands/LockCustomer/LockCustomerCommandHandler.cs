using ErrorOr;
using MediatR;
using SmartChain.Domain.Customer;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.Accounts.Commands.UpdateAccount;

namespace SmartChain.Application.Customers.Commands.LockCustomer;

public class LockCustomerCommandHandler : IRequestHandler<LockCustomerCommand, ErrorOr<Customer>>
{
    private readonly ICustomersRepository _CustomerRepository;
    private readonly IUsersRepository _userRepository;
    private readonly IAccountsRepository _accountRepository;

    public LockCustomerCommandHandler(
        ICustomersRepository CustomerRepository,
        IUsersRepository userRepository,
        IAccountsRepository accountRepository)
    {
        _CustomerRepository = CustomerRepository;
        _userRepository = userRepository;
        _accountRepository = accountRepository;
    }


    public async Task<ErrorOr<Customer>> Handle(LockCustomerCommand request, CancellationToken cancellationToken)
    {
        // Lấy thông tin Customer
        var Customer = await _CustomerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (Customer == null)
            return Error.NotFound("Customer not found");

        // Lấy thông tin Account dựa trên UserId
        var account = await _accountRepository.GetByIdAsync(Customer.AccountId, cancellationToken);
        if (account == null)
            return Error.NotFound("Account not found");

        // Cập nhật trạng thái tài khoản
        account.UpdateStatus();
        await _accountRepository.UpdateAsync(account, cancellationToken);

        return Customer;
    }
}