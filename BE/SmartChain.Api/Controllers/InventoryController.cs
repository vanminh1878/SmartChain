
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Products.Queries.GetProductForInventory;
using SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventory;
using SmartChain.Application.StockIntakes.Queries.GetPurchaseOrdersForInventory;
// using SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventoryHandler;

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
    [HttpGet("StockIntakes")]
    public async Task<IActionResult> GetAllStockIntakes()
    {
        var query = new GetStockIntakesForInventoryQuery();
        var result = await _mediator.Send(query);

        return result.Match(
            products => Ok(products),
            Problem);
    }

     [HttpGet("PurchaseOrders")]
    public async Task<IActionResult> GetAllPurchaseOrders()
    {
        var query = new GetPurchaseOrdersForInventoryQuery();
        var result = await _mediator.Send(query);

        return result.Match(
            products => Ok(products),
            Problem);
    }
}