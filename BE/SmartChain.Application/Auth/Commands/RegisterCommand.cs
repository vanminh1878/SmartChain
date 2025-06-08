// Application/Auth/Commands/RegisterCommand.cs
using ErrorOr;
using SmartChain.Domain.Account;
using SmartChain.Application.Auth;
using MediatR;

namespace SmartChain.Application.Auth.Commands
{
    public record RegisterCommand(
        string Username,
        string Password,
        string Fullname,
        string Email,
        string PhoneNumber,
        DateTime? Birthday,
        string? Address,
        bool? Sex,
        string? Avatar,
        string Role) : IRequest<ErrorOr<Account>>;
}