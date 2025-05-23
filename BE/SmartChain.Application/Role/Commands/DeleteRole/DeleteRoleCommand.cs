using ErrorOr;
using MediatR;

namespace SmartChain.Application.Roles.Commands.DeleteRole;

public record DeleteRoleCommand(Guid RoleId) : IRequest<ErrorOr<Success>>;