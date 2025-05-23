using ErrorOr;
using MediatR;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Roles.Queries.GetRole;

public record GetRoleQuery(Guid RoleId) : IRequest<ErrorOr<Role>>;