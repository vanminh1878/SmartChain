// Domain/Common/IPasswordHasher.cs
namespace SmartChain.Domain.Common
{
    public interface IPasswordHasher
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string passwordHash);
    }
}