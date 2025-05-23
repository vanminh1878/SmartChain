using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Roles.Queries.GetRole;

public class GetRoleQueryHandler : IRequestHandler<GetRoleQuery, ErrorOr<Role>>
{
    private readonly IRolesRepository _rolesRepository;

    public GetRoleQueryHandler(IRolesRepository rolesRepository)
    {
        _rolesRepository = rolesRepository;
    }

    public async Task<ErrorOr<Role>> Handle(GetRoleQuery request, CancellationToken cancellationToken)
    {
        var role = await _rolesRepository.GetByIdAsync(request.RoleId, cancellationToken);
        if (role is null)
        {
            return Error.NotFound(description: "Role not found.");
        }

        return role;
    }
}