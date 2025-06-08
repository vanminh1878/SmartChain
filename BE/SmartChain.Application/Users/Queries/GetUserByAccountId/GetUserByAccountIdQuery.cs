using ErrorOr;
using MediatR;
using SmartChain.Domain.User;
using SmartChain.Application.Users.Queries.GetUserByAccountId;

namespace SmartChain.Application.Users.Queries.GetUserByAccountId
{
    public record GetUserByAccountIdQuery(Guid AccountId) : IRequest<ErrorOr<ProfileResponse>>;
}