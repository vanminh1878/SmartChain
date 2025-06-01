using ErrorOr;
using MediatR;
using SmartChain.Domain.Employee;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.Accounts.Commands.UpdateAccount;

namespace SmartChain.Application.Employees.Commands.UpdateEmployee;

public class UpdateEmployeeCommandHandler : IRequestHandler<UpdateEmployeeCommand, ErrorOr<Employee>>
{
    private readonly IEmployeesRepository _employeeRepository;
    private readonly IUsersRepository _userRepository;
    private readonly IAccountsRepository _accountRepository;

    public UpdateEmployeeCommandHandler(
        IEmployeesRepository employeeRepository,
        IUsersRepository userRepository,
        IAccountsRepository accountRepository)
    {
        _employeeRepository = employeeRepository;
        _userRepository = userRepository;
        _accountRepository = accountRepository;
    }


    public async Task<ErrorOr<Employee>> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
    {
        // Lấy thông tin Employee
        var employee = await _employeeRepository.GetByIdAsync(request.Id, cancellationToken);
        if (employee == null)
            return Error.NotFound("Employee not found");
        // Lấy thông tin User dựa trên UserId
        var user = await _userRepository.GetByIdAsync(employee.UserId, cancellationToken);
        if (user == null)
            return Error.NotFound("User not found");
        // Cập nhật thông tin Employee
        employee.Update(request.StoreId);
        await _employeeRepository.UpdateAsync(employee, cancellationToken);
        // Cập nhật thông tin User
        user.Update(request.fullname, request.email, request.phoneNumber, request.birthday, request.address, request.sex, request.avatar );
        await _userRepository.UpdateAsync(user, cancellationToken);

        return employee;
    }
}