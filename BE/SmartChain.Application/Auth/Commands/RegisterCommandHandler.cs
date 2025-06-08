// Application/Auth/Commands/RegisterCommandHandler.cs
using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Account;
using SmartChain.Domain.User;
using SmartChain.Domain.Role;
using SmartChain.Domain.Common;

namespace SmartChain.Application.Auth.Commands
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, ErrorOr<Account>>
    {
        private readonly IAccountsRepository _accountsRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IRolesRepository _rolesRepository;
        private readonly IPasswordHasher _passwordHasher;

        public RegisterCommandHandler(
            IAccountsRepository accountsRepository,
            IUsersRepository usersRepository,
            IRolesRepository rolesRepository,
            IPasswordHasher passwordHasher)
        {
            _accountsRepository = accountsRepository;
            _usersRepository = usersRepository;
            _rolesRepository = rolesRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task<ErrorOr<Account>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            // Kiểm tra username hoặc email đã tồn tại
            var existingAccount = await _accountsRepository.GetByUsernameAsync(request.Username, cancellationToken);
            if (existingAccount != null)
                return Error.Conflict("Username đã tồn tại.");

            var existingUser = await _usersRepository.GetByEmailAsync(request.Email, cancellationToken);
            if (existingUser != null)
                return Error.Conflict("Email đã tồn tại.");

            // Tìm role
            var role = await _rolesRepository.GetByNameAsync(request.Role, cancellationToken);
            if (role == null)
                return Error.NotFound("Role không tồn tại.");

            // Tạo account
            var account = new Account(request.Username, request.Password);
            await _accountsRepository.AddAsync(account, cancellationToken);

            // Tạo user
            var user = new User(
                request.Fullname,
                request.Email,
                request.PhoneNumber,
                request.Birthday ?? DateTime.UtcNow,
                request.Address,
                request.Sex ?? false,
                request.Avatar,
                account.Id,
                role.Id);

            await _usersRepository.AddAsync(user, cancellationToken);

            return account;
        }
    }
}