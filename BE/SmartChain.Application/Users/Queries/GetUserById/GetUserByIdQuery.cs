using ErrorOr;
using MediatR;
using SmartChain.Domain.User;

namespace SmartChain.Application.Users.Queries.GetUserById
{
    public record GetUserByIdQuery(Guid UserId) : IRequest<ErrorOr<User>>;
}