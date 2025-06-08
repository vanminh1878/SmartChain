// Application/Common/Interfaces/IAuthService.cs
using ErrorOr;
using SmartChain.Application.Auth;
using SmartChain.Domain.Account;

namespace SmartChain.Application.Common.Interfaces
{
    public interface IAuthService
    {
        Task<ErrorOr<Account>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken);
        Task<ErrorOr<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
    }
}