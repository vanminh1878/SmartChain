using ErrorOr;
using MediatR;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Roles.Queries.GetRoleById
{
    public record GetRoleByIdQuery(Guid RoleId) : IRequest<ErrorOr<Role>>;
}