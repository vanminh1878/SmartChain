using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Role;

namespace SmartChain.Application.Roles.Commands.CreateRole;

public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, ErrorOr<Role>>
{
    private readonly IRolesRepository _rolesRepository;

    public CreateRoleCommandHandler(IRolesRepository rolesRepository)
    {
        _rolesRepository = rolesRepository;
    }

    public async Task<ErrorOr<Role>> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var role = new Role(request.Name);
            await _rolesRepository.AddAsync(role, cancellationToken);
            return role;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}