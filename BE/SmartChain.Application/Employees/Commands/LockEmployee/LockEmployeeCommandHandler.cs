using ErrorOr;
using MediatR;
using SmartChain.Domain.Employee;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.Accounts.Commands.UpdateAccount;

namespace SmartChain.Application.Employees.Commands.LockEmployee;

public class LockEmployeeCommandHandler : IRequestHandler<LockEmployeeCommand, ErrorOr<Employee>>
{
    private readonly IEmployeesRepository _employeeRepository;
    private readonly IUsersRepository _userRepository;
    private readonly IAccountsRepository _accountRepository;

    public LockEmployeeCommandHandler(
        IEmployeesRepository employeeRepository,
        IUsersRepository userRepository,
        IAccountsRepository accountRepository)
    {
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _accountRepository = accountRepository;
    }


    public async Task<ErrorOr<Employee>> Handle(LockEmployeeCommand request, CancellationToken cancellationToken)
    {
        // Lấy thông tin Employee
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, cancellationToken);
        if (employee == null)
            return Error.NotFound("Employee not found");

        // Lấy thông tin Account dựa trên UserId
        var account = await _userRepository.GetAccountByUserIdAsync(employee.UserId, cancellationToken);
        if (account == null)
            return Error.NotFound("Account not found");

        // Cập nhật trạng thái tài khoản
        account.UpdateStatus();
        await _accountRepository.UpdateAsync(account, cancellationToken);

        return employee;
    }
}