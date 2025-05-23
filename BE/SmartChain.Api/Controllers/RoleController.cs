using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Roles.Commands.CreateRole;
using SmartChain.Application.Roles.Commands.DeleteRole;
using SmartChain.Application.Roles.Commands.UpdateRole;
using SmartChain.Application.Roles.Queries.GetRole;
using SmartChain.Contracts.Roles;
using SmartChain.Domain.Role;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("roles")]
public class RolesController : ApiController
{
    private readonly ISender _mediator;

    public RolesController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateRole(CreateRoleRequest request)
    {
        var command = new CreateRoleCommand(request.Name);
        var result = await _mediator.Send(command);

        return result.Match(
            role => CreatedAtAction(
                actionName: nameof(GetRole),
                routeValues: new { RoleId = role.Id },
                value: ToDto(role)),
            Problem);
    }

    [HttpPut("{roleId:guid}")]
    public async Task<IActionResult> UpdateRole(Guid roleId, UpdateRoleRequest request)
    {
        var command = new UpdateRoleCommand(roleId, request.Name);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpDelete("{roleId:guid}")]
    public async Task<IActionResult> DeleteRole(Guid roleId)
    {
        var command = new DeleteRoleCommand(roleId);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpGet("{roleId:guid}")]
    public async Task<IActionResult> GetRole(Guid roleId)
    {
        var query = new GetRoleQuery(roleId);
        var result = await _mediator.Send(query);

        return result.Match(
            role => Ok(ToDto(role)),
            Problem);
    }



    private RoleResponse ToDto(Role role) =>
        new(role.Id, role.Name, role.CreatedAt, role.UpdatedAt);
}