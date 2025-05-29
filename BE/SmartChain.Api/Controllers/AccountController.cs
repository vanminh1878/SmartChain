using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Accounts.Commands.CreateAccount;
using SmartChain.Application.Accounts.Commands.LockAccount;
using SmartChain.Application.Accounts.Commands.UpdateAccount;
using SmartChain.Application.Accounts.Queries.GetAccount;
using SmartChain.Application.Accounts.Queries.GetAccountByStatus;
using SmartChain.Contracts.Accounts;
using SmartChain.Domain.Account;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("Accounts")]
public class AccountsController : ApiController
{
    private readonly ISender _mediator;

    public AccountsController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAccount(CreateAccountRequest request)
    {
        var command = new CreateAccountCommand(request.username, request.password);
        var result = await _mediator.Send(command);

        return result.Match(
            Account => CreatedAtAction(
                actionName: nameof(GetAccount),
                routeValues: new { AccountId = Account.Id },
                value: ToDto(Account)),
            Problem);
    }

    [HttpPut("{AccountId:guid}")]
    public async Task<IActionResult> UpdateAccount(Guid AccountId, UpdateAccountRequest request)
    {
        var command = new UpdateAccountCommand(AccountId, request.password);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpDelete("{AccountId:guid}")]
    public async Task<IActionResult> DeleteAccount(Guid AccountId)
    {
        var command = new LockAccountCommand(AccountId);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpGet("{ByStatus}")]
    public async Task<IActionResult> GetAccountByStatus(bool newStatus)
    {
        var query = new GetAccountByStatusQuery(newStatus);
        var result = await _mediator.Send(query);

        return result.Match(
            Accounts => Ok(Accounts.Select(ToDto).ToList()),
            Problem);
    }

     [HttpGet("")]
    public async Task<IActionResult> GetAccount()
    {
        var query = new GetAccountQuery();
        var result = await _mediator.Send(query);

        return result.Match(
            Accounts => Ok(Accounts.Select(ToDto).ToList()),
            Problem);
    }


    private AccountResponse ToDto(Account Account) =>
        new(Account.Id, Account.Username, Account.Password, Account.Status, Account.CreatedAt, Account.UpdatedAt);
}