// Application/Common/Interfaces/IJwtTokenService.cs
using System.Security.Claims;

namespace SmartChain.Application.Common.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(IEnumerable<Claim> claims);
    }
}
