using ErrorOr;
using MediatR;
using SmartChain.Domain.User;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Users.Queries.GetUser
{
    public record GetUserQuery() : IRequest<ErrorOr<List<User>>>;
}