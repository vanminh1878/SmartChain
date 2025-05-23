using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Roles.Commands.UpdateRole;

public class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, ErrorOr<Success>>
{
    private readonly IRolesRepository _rolesRepository;

    public UpdateRoleCommandHandler(IRolesRepository rolesRepository)
    {
        _rolesRepository = rolesRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _rolesRepository.GetByIdAsync(request.RoleId, cancellationToken);
        if (role is null)
        {
            return Error.NotFound(description: "Role not found.");
        }

        var result = role.UpdateName(request.Name);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _rolesRepository.UpdateAsync(role, cancellationToken);
        return Result.Success;
    }
}