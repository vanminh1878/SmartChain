using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Stores.Commands.CreateStore;
using SmartChain.Application.Stores.Commands.UpdateStore;
using SmartChain.Application.Stores.Queries.GetStore;
using SmartChain.Application.Stores.Queries.GetStoreByStatus;
using SmartChain.Application.Stores.Queries.GetStoreById;
using SmartChain.Contracts.Stores;
using SmartChain.Domain.Store;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("Stores")]
public class StoresController : ApiController
{
    private readonly ISender _mediator;

    public StoresController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateStore(CreateStoreRequest request)
    {
        var command = new CreateStoreCommand(request.name, request.email, request.phoneNumber,
                                             request.address, request.ownerId);
        var result = await _mediator.Send(command);

        return result.Match(
            Store => CreatedAtAction(
                actionName: nameof(GetStore),
                routeValues: new { StoreId = Store.Id },
                value: ToDto(Store)),
            Problem);
    }

    [HttpPut("{StoreId:guid}")]
    public async Task<IActionResult> UpdateStore(Guid StoreId, UpdateStoreRequest request)
    {
        var command = new UpdateStoreCommand(StoreId, request.name, request.email, request.phoneNumber, request.address);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }


    [HttpGet("ByStatus")]
    public async Task<IActionResult> GetStoreById(bool status)
    {
         var query = new GetStoreByStatusQuery(status);
        var result = await _mediator.Send(query);

        return result.Match(
            Stores => Ok(Stores.Select(ToDto).ToList()),
            Problem);
    }
    
    [HttpGet("{storeId:guid}")]
    public async Task<IActionResult> GetStoreById(Guid storeId)
    {
        var query = new GetStoreByIdQuery(storeId);
        var result = await _mediator.Send(query);

        return result.Match(
            role => Ok(ToDto(role)),
            Problem);
    }

     [HttpGet("")]
    public async Task<IActionResult> GetStore()
    {
        var query = new GetStoreQuery();
        var result = await _mediator.Send(query);

        return result.Match(
            Stores => Ok(Stores.Select(ToDto).ToList()),
            Problem);
    }


    private StoreResponse ToDto(Store Store) =>
        new(Store.Id,
            Store.Name,
            Store.Address,
            Store.PhoneNumber,
            Store.Email,
            Store.Status,
            Store.OwnerId,
            Store.CreatedAt,
            Store.UpdatedAt);
}