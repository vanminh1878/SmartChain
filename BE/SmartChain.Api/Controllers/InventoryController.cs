
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Products.Queries.GetProductForInventory;
using SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventory;
using SmartChain.Application.StockIntakes.Queries.GetPurchaseOrdersForInventory;
using SmartChain.Application.Products.Commands.CreateProduct;
using SmartChain.Application.Products.Queries.GetProduct;
using SmartChain.Application.StockIntakes.Commands.CreateStockIntake;
using SmartChain.Application.StockIntakeDetails.Queries;
using SmartChain.Application.StockIntakeDetails.Commands.CreateStockIntakeDetail;
using SmartChain.Application.StockIntakes.Queries;
using SmartChain.Application.StockIntakes.Queries.GetStockIntakeById;
using SmartChain.Application.StockIntakes.Queries.GetStockIntake;
using SmartChain.Contracts.StockIntakes;
using SmartChain.Application.StockIntakes.Commands.UpdateStatusStockIntake;

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

    [HttpPost("StockIntakes")]
    public async Task<IActionResult> CreateStockIntake(CreateStockIntakeCommand command)
    {
        var result = await _mediator.Send(command);

        return result.Match(
            stockIntake => CreatedAtAction(
                nameof(GetStockIntake),
                new { id = stockIntake.Id },
                stockIntake),
            Problem);
    }
    [HttpGet("StockIntakes")]
    public async Task<IActionResult> GetStockIntake()
    {
        var query = new GetStockIntakeQuery();
        var result = await _mediator.Send(query);

        return result.Match(
            stockIntake => Ok(stockIntake),
            Problem);
    }

    [HttpPost("StockIntakeDetails")]
    public async Task<IActionResult> CreateStockIntakeDetail(CreateStockIntakeDetailCommand command)
    {
        var result = await _mediator.Send(command);

        return result.Match(
            stockIntakeDetail => CreatedAtAction(
                nameof(GetStockIntakeDetail),
                new { id = stockIntakeDetail.Id },
                stockIntakeDetail),
            Problem);
    }

    [HttpGet("StockIntakeDetails/{id:guid}")]
    public async Task<IActionResult> GetStockIntakeDetail(Guid id)
    {
        var query = new GetStockIntakeDetailQuery(id);
        var result = await _mediator.Send(query);

        return result.Match(
            stockIntakeDetail => Ok(stockIntakeDetail),
            Problem);
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
    [HttpGet("StockIntakesById/{stockIntakeId:guid}")]
    public async Task<IActionResult> GetAllStockIntakes(Guid stockIntakeId)
    {
        var query = new GetStockIntakeByIdQuery(stockIntakeId);
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

     [HttpPut("{StockIntakeId:guid}/status")]
    public async Task<IActionResult> UpdateOrderStatus(Guid StockIntakeId, UpdateStockIntakeStatusRequest request)
    {
        var command = new UpdateStatusStockIntakeCommand( request.Status,StockIntakeId);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem
        );
    }
}