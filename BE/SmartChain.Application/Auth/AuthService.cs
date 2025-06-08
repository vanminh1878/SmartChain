// Application/Services/AuthService.cs
using ErrorOr;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.Auth;
using SmartChain.Domain.Account;
using SmartChain.Domain.User;
using SmartChain.Domain.Role;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Common;

namespace SmartChain.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAccountsRepository _accountsRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IRolesRepository _rolesRepository;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IPasswordHasher _passwordHasher;

        public AuthService(
            IAccountsRepository accountsRepository,
            IUsersRepository usersRepository,
            IRolesRepository rolesRepository,
            IJwtTokenService jwtTokenService,
            IPasswordHasher passwordHasher)
        {
            _accountsRepository = accountsRepository;
            _usersRepository = usersRepository;
            _rolesRepository = rolesRepository;
            _jwtTokenService = jwtTokenService;
            _passwordHasher = passwordHasher;
        }

        public async Task<ErrorOr<Account>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
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

        public async Task<ErrorOr<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
        {
            var account = await _accountsRepository.GetByUsernameAsync(request.Username, cancellationToken);
            if (account == null)
            {
                var user = await _usersRepository.GetByEmailAsync(request.Username, cancellationToken);
                if (user == null)
                    return Error.NotFound("Username hoặc email không tồn tại.");

                account = await _usersRepository.GetAccountByUserIdAsync(user.Id, cancellationToken);
                if (account == null)
                    return Error.NotFound("Tài khoản không tồn tại.");
            }

            if (!account.VerifyPassword(request.Password))
                return Error.Failure("Mật khẩu không đúng.");

            if (account.Status == false)
                return Error.Failure("Tài khoản đã bị khóa.");

            var userInfo = await _usersRepository.GetByAccountIdAsync(account.Id, cancellationToken);
            if (userInfo == null)
                return Error.NotFound("Thông tin người dùng không tồn tại.");

            var role = await _rolesRepository.GetByIdAsync(userInfo.RoleId, cancellationToken);
            if (role == null)
                return Error.NotFound("Role không tồn tại.");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
                new Claim(ClaimTypes.Name, account.Username),
                new Claim(ClaimTypes.Email, userInfo.Email),
                new Claim(ClaimTypes.Role, role.Name)
            };

            var token = _jwtTokenService.GenerateToken(claims);
            return new LoginResponse(token,userInfo);
        }
    }
}