using ErrorOr;
using MediatR;
using SmartChain.Application.Accounts.Commands.CreateAccount;
using SmartChain.Application.Users.Commands.CreateUser;
using SmartChain.Domain.Employee;
using SmartChain.Application.Common.Interfaces;
using System.Transactions;

namespace SmartChain.Application.Employees.Commands.CreateEmployee;

public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, ErrorOr<Employee>>
{
    private readonly IEmployeesRepository _employeeRepository;
    private readonly IAccountsRepository _accountRepository;
    private readonly IUsersRepository _userRepository;
    private readonly IStoresRepository _storeRepository;
    private readonly ISender _mediator;

    public CreateEmployeeCommandHandler(
        IEmployeesRepository employeeRepository,
        IAccountsRepository accountRepository,
        IUsersRepository userRepository,
        IStoresRepository storeRepository,
        ISender mediator)
    {
        _employeeRepository = employeeRepository;
        _accountRepository = accountRepository;
        _userRepository = userRepository;
        _storeRepository = storeRepository;
        _mediator = mediator;
    }

    public async Task<ErrorOr<Employee>> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
    {
        // Kiểm tra StoreId tồn tại
        var store = await _storeRepository.GetByIdAsync(request.StoreId, cancellationToken);
        if (store == null)
            return Error.NotFound("Store not found");

        // Kiểm tra Username đã tồn tại
        var existingAccount = await _accountRepository.GetByUsernameAsync(request.Username, cancellationToken);
        if (existingAccount != null)
            return Error.Conflict("Username already exists");

        // Kiểm tra Email đã tồn tại
        var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (existingUser != null)
            return Error.Conflict("Email already exists");

        // Sử dụng TransactionScope để đảm bảo toàn vẹn dữ liệu
        using var transaction = new TransactionScope(
            TransactionScopeOption.Required,
            new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted },
            TransactionScopeAsyncFlowOption.Enabled);

        try
        {
            // Tạo Account
            var createAccountCommand = new CreateAccountCommand(request.Username, request.Password);
            var accountResult = await _mediator.Send(createAccountCommand, cancellationToken);
            if (accountResult.IsError)
                return accountResult.Errors;

            var account = accountResult.Value;

            // Tạo User
            var createUserCommand = new CreateUserCommand(
                request.Fullname,
                request.Email,
                request.PhoneNumber,
                request.Birthday,
                request.Address,
                request.Sex,
                request.Avatar,
                account.Id,
                request.RoleId);
            var userResult = await _mediator.Send(createUserCommand, cancellationToken);
            if (userResult.IsError)
                return userResult.Errors;

            var user = userResult.Value;

            // Tạo Employee
            var employee = new Employee(user.Id,request.StoreId);

            // Kiểm tra xem User đã là nhân viên của Store này chưa
            var existingEmployee = await _employeeRepository.GetByUserIdAndStoreIdAsync(
                user.Id, request.StoreId, cancellationToken);
            if (existingEmployee != null)
                return Error.Conflict("User is already an employee of this store");

            await _employeeRepository.AddAsync(employee, cancellationToken);

            // Hoàn tất giao dịch
            transaction.Complete();

            return employee;
        }
        catch (Exception ex)
        {
            return Error.Failure(description: $"Failed to create employee: {ex.Message}");
        }
    }
}