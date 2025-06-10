
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Products.Queries.GetProductForInventory;
using SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventory;
using SmartChain.Application.StockIntakes.Queries.GetPurchaseOrdersForInventory;
using SmartChain.Application.Products.Commands.CreateProduct;
using SmartChain.Application.Products.Queries.GetProduct;
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
    public async Task<IActionResult> GetAllProductsForInventory()
    {
        var query = new GetProductForInventoryQuery();
        var result = await _mediator.Send(query);

        return result.Match(
            products => Ok(products),
            Problem);
    }
    [HttpGet("ListProducts")]
    public async Task<IActionResult> GetListProducts()
    {
        var query = new GetProductQuery();
        var result = await _mediator.Send(query);

        return result.Match(
            products => Ok(products),
            Problem);
    }

    [HttpPost("Products")]
    public async Task<IActionResult> CreateProduct(CreateProductCommand command)
    {
        var result = await _mediator.Send(command);

        return result.Match(
            product => CreatedAtAction(nameof(GetListProducts),
                                        new { id = product.Id },
                                        product),
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