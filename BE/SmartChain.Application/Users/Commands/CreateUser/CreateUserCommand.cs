using ErrorOr;
using MediatR;
using SmartChain.Domain.User;

namespace SmartChain.Application.Users.Commands.CreateUser;

public record CreateUserCommand(string fullname, string email, string phoneNumber, DateTime birthday, string address, bool sex, string avatar, Guid accountId,Guid roleId) : IRequest<ErrorOr<User>>;