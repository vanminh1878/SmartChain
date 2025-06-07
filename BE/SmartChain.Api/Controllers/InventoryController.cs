
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Products.Queries.GetProductForInventory;
using SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventory;
using SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventoryHandler;

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
    [HttpGet("StockIntakes/{storeId:guid}")]
    public async Task<IActionResult> GetAllStockIntakes(Guid storeId)
    {
        var query = new GetStockIntakesForInventoryQuery(storeId);
        var result = await _mediator.Send(query);

        return result.Match(
            products => Ok(products),
            Problem);
    }

    //  [HttpGet("PurchaseOrders")]
    // public async Task<IActionResult> GetAllPurchaseOrders()
    // {
    //     var query = new GetPurchaseOrdersForInventory();
    //     var result = await _mediator.Send(query);

    //     return result.Match(
    //         products => Ok(products),
    //         Problem);
    // }
}