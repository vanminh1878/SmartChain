
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Products.Queries.GetProductForInventory;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("Inventory")]
public class InventoryController : ApiController
{
    private readonly ISender _mediator;

    public InventoryController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("Products")]
    public async Task<IActionResult> GetAllProducts()
    {
        var query = new GetProductForInventoryQuery();
        var result = await _mediator.Send(query);

        return result.Match(
            products => Ok(products),
            Problem);
    }

    // [HttpGet("Product/{productId:guid}")]
    // public async Task<IActionResult> GetProductById(Guid productId)
    // {
    //     var query = new GetProductByIdQuery(productId);
    //     var result = await _mediator.Send(query);

    //     return result.Match(
    //         product => Ok(ToDto(product)),
    //         Problem);
    // }
}