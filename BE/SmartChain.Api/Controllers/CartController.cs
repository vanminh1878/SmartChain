using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Carts.Commands.CreateCarts;
using SmartChain.Application.Carts.Commands.UpdateCartDetail;
using SmartChain.Application.Carts.Commands.DeleteCartDetail;
using SmartChain.Application.Carts.Queries.GetCartById;
using SmartChain.Contracts.Carts;
using SmartChain.Domain.Cart;
using SmartChain.Application.Carts.Commands.UpdateCartDetailNewQuantity;
using SmartChain.Application.Carts.Commands.CreateCartForCustomer;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("Carts")]
public class CartsController : ApiController
{
    private readonly ISender _mediator;

    public CartsController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCart(CreateCartRequest request)
    {
        var command = new CreateCartCommand(
            request.CustomerId,
            request.StoreId,
            request.ProductId,
            request.Quantity
        );
        var result = await _mediator.Send(command);

        return result.Match(
            cart => CreatedAtAction(nameof(GetCartById), new { CartId = cart.Id }, ToDto(cart)),
            Problem
        );
    }

    [HttpPost("Customer")]
    public async Task<IActionResult> CreateCartForCustomer(CreateCartRequest request)
    {
        var command = new CreateCartForCustomerCommand(
            request.CustomerId,
            request.StoreId
        );
        var result = await _mediator.Send(command);

        return result.Match(
            cart => CreatedAtAction(nameof(GetCartById), new { CartId = cart.Id }, cart),
            Problem
        );
    }

    [HttpPut("{CartId:guid}/details")]
    public async Task<IActionResult> UpdateCartDetail(Guid CartId, UpdateCartDetailRequest request)
    {
        var command = new UpdateCartDetailCommand(CartId, request.ProductId, request.Quantity);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem
        );
    }

    [HttpPut("{CartId:guid}/details/newquantity")]
    public async Task<IActionResult> UpdateCartDetailNewQuantity(Guid CartId, UpdateCartDetailRequest request)
    {
        var command = new UpdateCartDetailNewQuantityCommand(CartId, request.ProductId, request.Quantity);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem
        );
    }


    [HttpDelete("{CartId:guid}/details/{ProductId:guid}")]
    public async Task<IActionResult> RemoveCartDetail(Guid CartId, Guid ProductId)
    {
        var command = new DeleteCartDetailCommand( ProductId, CartId);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem
        );
    }

    [HttpGet("{CartId:guid}")]
    public async Task<IActionResult> GetCartById(Guid CartId)
    {
        var query = new GetCartByIdQuery(CartId);
        var result = await _mediator.Send(query);

        return result.Match(
            cart => Ok(ToDto(cart)),
            Problem
        );
    }

    private CartResponse ToDto(Cart cart) =>
        new CartResponse(
            cart.Id,
            cart.CustomerId,
            cart.StoreId,
            cart.CreatedAt,
            cart.UpdatedAt,
            cart.CartDetails.Select(cd => new CartDetailResponse(cd.ProductId, cd.Quantity, cd.Price)).ToList()
        );
}