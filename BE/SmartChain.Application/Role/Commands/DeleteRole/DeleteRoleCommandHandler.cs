using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;

namespace SmartChain.Application.Roles.Commands.DeleteRole;

public class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand, ErrorOr<Success>>
{
    private readonly IRolesRepository _rolesRepository;

    public DeleteRoleCommandHandler(IRolesRepository rolesRepository)
    {
        _rolesRepository = rolesRepository;
    }

    public async Task<ErrorOr<Success>> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _rolesRepository.GetByIdAsync(request.RoleId, cancellationToken);
        if (role is null)
        {
            return Error.NotFound(description: "Role not found.");
        }

        await _rolesRepository.RemoveAsync(role, cancellationToken);
        return Result.Success;
    }
}