using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Suppliers.Commands.CreateSupplier;
using SmartChain.Application.Suppliers.Commands.DeleteSupplier;
using SmartChain.Application.Suppliers.Commands.UpdateSupplier;
using SmartChain.Application.Suppliers.Queries.GetSupplier;
using SmartChain.Application.Suppliers.Queries.GetSupplierById;
using SmartChain.Contracts.Supplier;
using SmartChain.Domain.Supplier;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("/Suppliers")]
public class SupplierController : ApiController
{
    private readonly ISender _mediator;

    public SupplierController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateSupplier( CreateSupplierRequest request)
    {
        var command = new CreateSupplierCommand( request.Name, request.Contact_Name, request.PhoneNumber, request.Email, request.Address);
        var result = await _mediator.Send(command);

        return result.Match(
            Supplier => CreatedAtAction(
                actionName: nameof(GetSupplier),
                routeValues: new {  SupplierId = Supplier.Id },
                value: ToDto(Supplier)),
            Problem);
    }

    [HttpPut("{SupplierId:guid}")]
    public async Task<IActionResult> UpdateSupplier( Guid SupplierId, UpdateSupplierRequest request)
    {
        var command = new UpdateSupplierCommand(SupplierId, request.Name, request.Contact_Name, request.Address , request.Email,request.PhoneNumber);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpDelete("{SupplierId:guid}")]
    public async Task<IActionResult> DeleteSupplier(Guid SupplierId)
    {
        var command = new DeleteSupplierCommand(SupplierId);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem);
    }

    [HttpGet("{SupplierId:guid}")]
    public async Task<IActionResult> GetSupplier( Guid SupplierId)
    {
        var query = new GetSupplierByIdQuery(SupplierId);
        var result = await _mediator.Send(query);

        return result.Match(
            Supplier => Ok(ToDto(Supplier)),
            Problem);
    }
     [HttpGet("")]
    public async Task<IActionResult> GetSupplier()
    {
        var query = new GetSupplierQuery();
        var result = await _mediator.Send(query);

        return result.Match(
            Supplier => Ok(Supplier.Select(ToDto).ToList()),
            Problem);
    }


    private SupplierResponse ToDto(Supplier Supplier) =>
        new(Supplier.Id, Supplier.Name, Supplier.Contact_name, Supplier.Address, Supplier.Email, Supplier.PhoneNumber, Supplier.CreatedAt, Supplier.UpdatedAt);
}