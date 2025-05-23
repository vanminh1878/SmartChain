using ErrorOr;
using MediatR;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Roles.Commands.CreateRole;

public record CreateRoleCommand(string Name) : IRequest<ErrorOr<Role>>;