using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.Auth;
using SmartChain.Domain.Account;
using SmartChain.Domain.User;
using SmartChain.Domain.Role;
using System.Security.Claims;
using SmartChain.Domain.Common;

namespace SmartChain.Application.Auth.Queries
{
    public class LoginQueryHandler : IRequestHandler<LoginQuery, ErrorOr<LoginResponse>>
    {
        private readonly IAccountsRepository _accountsRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IRolesRepository _rolesRepository;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IPasswordHasher _passwordHasher;

        public LoginQueryHandler(
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

        public async Task<ErrorOr<LoginResponse>> Handle(LoginQuery request, CancellationToken cancellationToken)
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

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
                new Claim(ClaimTypes.Name, account.Username)
            };

            // Thử lấy thông tin người dùng từ UsersRepository (cho admin, staff, v.v.)
            var userInfo = await _usersRepository.GetByAccountIdAsync(account.Id, cancellationToken);
            if (userInfo != null)
            {
                // Thêm Claim cho email nếu userInfo tồn tại
                claims.Add(new Claim(ClaimTypes.Email, userInfo.Email));

                // Thêm Claim cho vai trò nếu RoleId tồn tại
                if (userInfo.RoleId != null)
                {
                    var role = await _rolesRepository.GetByIdAsync(userInfo.RoleId, cancellationToken);
                    if (role != null)
                    {
                        claims.Add(new Claim(ClaimTypes.Role, role.Name));
                    }
                }
            }

            var token = _jwtTokenService.GenerateToken(claims);
            return new LoginResponse(token, userInfo);
        }
    }
}