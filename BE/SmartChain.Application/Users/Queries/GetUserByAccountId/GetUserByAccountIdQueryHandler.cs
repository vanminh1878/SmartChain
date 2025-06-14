using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.User;
using SmartChain.Application.Users.Queries.GetUserByAccountId;

namespace SmartChain.Application.Users.Queries.GetUserByAccountId;

public class GetUserByAccountIdQueryHandler : IRequestHandler<GetUserByAccountIdQuery, ErrorOr<ProfileResponse>>
{
    private readonly IUsersRepository _UsersRepository;
    private readonly IRolesRepository _RolesRepository;
    private readonly IAccountsRepository _AccountsRepository;
    private readonly IEmployeesRepository _EmployeesRepository;

    public GetUserByAccountIdQueryHandler(IUsersRepository usersRepository, IRolesRepository rolesRepository,
                                            IAccountsRepository accountsRepository, IEmployeesRepository employeesRepository)
    {
        _UsersRepository = usersRepository;
        _RolesRepository = rolesRepository;
        _AccountsRepository = accountsRepository;
        _EmployeesRepository = employeesRepository;
    }

    public async Task<ErrorOr<ProfileResponse>> Handle(GetUserByAccountIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _UsersRepository.GetByAccountIdAsync(request.AccountId, cancellationToken);
        if (user is null)
        {
            return Error.NotFound(description: "User not found.");
        }
        var account = await _AccountsRepository.GetByIdAsync(request.AccountId, cancellationToken);
        if (account is null)
        {
            return Error.NotFound(description: "Account not found.");
        }
        var role = await _RolesRepository.GetByIdAsync(user.RoleId, cancellationToken);
        if (role is null)
        {
            return Error.NotFound(description: "Role not found.");
        }
        var employee = await _EmployeesRepository.GetByUserIdAsync(user.Id, cancellationToken);
        if (employee is null)
        {
            return Error.NotFound(description: "Employee not found");
        }
        // Tạo DTO
        var response = new ProfileResponse(account.Username,user.Fullname, user.Email, user.PhoneNumber,
                                         user.Birthday, user.Address, user.Sex, user.Avatar, role.Name,employee.StoreId,user.Id);

        return response; 
    }
}