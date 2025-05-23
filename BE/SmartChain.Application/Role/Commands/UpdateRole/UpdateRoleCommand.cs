using ErrorOr;
using MediatR;

namespace SmartChain.Application.Roles.Commands.UpdateRole;

public record UpdateRoleCommand(Guid RoleId, string Name) : IRequest<ErrorOr<Success>>;