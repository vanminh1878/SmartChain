// Application/Contracts/Auth/RegisterRequest.cs
namespace SmartChain.Application.Auth
{
    public record RegisterRequest(
        string Username,
        string Password,
        string Fullname,
        string Email,
        string PhoneNumber,
        DateTime? Birthday,
        string? Address,
        bool? Sex,
        string? Avatar,
        string Role);
}



