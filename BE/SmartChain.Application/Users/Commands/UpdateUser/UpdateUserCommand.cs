using ErrorOr;
using MediatR;

namespace SmartChain.Application.Users.Commands.UpdateUser;

public record UpdateUserCommand(Guid AccountId,string fullname, string email,
string phoneNumber, DateTime birthday, string address, bool sex, string avatar) : IRequest<ErrorOr<Success>>;
