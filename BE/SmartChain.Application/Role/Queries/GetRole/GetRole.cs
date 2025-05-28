using ErrorOr;
using MediatR;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Roles.Queries.GetRole
{
    public record GetRoleQuery() : IRequest<ErrorOr<List<Role>>>;
}