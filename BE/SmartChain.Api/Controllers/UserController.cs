using System.Security.Claims;
using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Users.Commands.CreateUser;
using SmartChain.Application.Users.Commands.UpdateUser;
using SmartChain.Application.Users.Queries.GetUser;
using SmartChain.Application.Users.Queries.GetUserByAccountId;
using SmartChain.Application.Users.Queries.GetUserById;
using SmartChain.Contracts.User;
using SmartChain.Domain.User;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("Users")]
public class UsersController : ApiController
{
    private readonly ISender _mediator;

    public UsersController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserRequest request)
    {
        var command = new CreateUserCommand(request.fullname, request.email, request.phoneNumber,
                                            request.birthday, request.address,request.sex, request.avatar, request.accountId, request.roleId);
        var result = await _mediator.Send(command);

        return result.Match(
            User => CreatedAtAction(
                actionName: nameof(GetUser),
                routeValues: new { UserId = User.Id },
                value: ToDto(User)),
            Problem);
    }

    [HttpPut("{UserId:guid}")]
    public async Task<IActionResult> UpdateUser(Guid UserId, UpdateUserRequest request)
    {
        var command = new UpdateUserCommand(UserId, request.fullname, request.email, request.phoneNumber,
                                            request.birthday, request.address,request.sex, request.avatar);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }


    [HttpGet("{userId:guid}")]
    public async Task<IActionResult> GetUserById(Guid userId)
    {
         var query = new GetUserByIdQuery(userId);
        var result = await _mediator.Send(query);

        return result.Match(
            role => Ok(ToDto(role)),
            Problem);
    }

     [HttpGet("")]
    public async Task<IActionResult> GetUser()
    {
        var query = new GetUserQuery();
        var result = await _mediator.Send(query);

        return result.Match(
            Users => Ok(Users.Select(ToDto).ToList()),
            Problem);
    }
    [HttpGet("Profile")]
    public async Task<IActionResult> GetProfile()
    {
        // var claims = User.Claims.Select(c => $"{c.Type}: {c.Value}").ToList();
        // Console.WriteLine("Claims: " + string.Join(", ", claims));

        var accountId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //Console.WriteLine($"AccountId: {accountId}");
        if (accountId == null)
        {
            return Unauthorized();
        }

        var query = new GetUserByAccountIdQuery(Guid.Parse(accountId));
        var result = await _mediator.Send(query);

        return result.Match(
            user => Ok(user),
            Problem);
    }
    [HttpPut("Profile")]
    public async Task<IActionResult> UpdateProfile(UpdateUserRequest request)
    {
        var accountId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (accountId == null)
        {
            return Unauthorized();
        }

        var command = new UpdateUserCommand(Guid.Parse(accountId),request.fullname, request.email, request.phoneNumber,
                                            request.birthday, request.address, request.sex, request.avatar);
        var result = await _mediator.Send(command);

         return result.Match(
            _ => NoContent(),
            Problem);
    }
    private UserResponse ToDto(User User) =>
        new(User.Id,
            User.Fullname,
            User.Email,
            User.PhoneNumber,
            User.Birthday,
            User.Address,
            User.Sex,
            User.Avatar,
            User.AccountId,
            User.RoleId,
            User.CreatedAt,
            User.UpdatedAt);
}