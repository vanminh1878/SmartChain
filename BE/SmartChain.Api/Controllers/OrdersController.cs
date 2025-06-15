using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartChain.Application.Orders.Commands.CreateOrder;
using SmartChain.Application.Orders.Commands.UpdateStatusOrder;
using SmartChain.Application.Orders.Queries.GetOrderByCustomerId;
using SmartChain.Application.Orders.Queries.GetOrderById;
using SmartChain.Application.Orders.Queries.GetOrderDetailByOrderId;
using SmartChain.Application.Orders.Queries.GetOrders;
using SmartChain.Contracts.Orders;
using SmartChain.Domain.Order;

namespace SmartChain.Api.Controllers;

[ApiController]
[Route("Orders")]
public class OrdersController : ApiController
{
    private readonly ISender _mediator;

    public OrdersController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(CreateOrderRequest request)
    {
        var command = new CreateOrderCommand(
            request.CustomerId,
            request.StoreId,
            request.CartId,
            request.OrderDetails.Select(od => new OrderDetailCommand(od.ProductId, od.Quantity)).ToList()
        );
        var result = await _mediator.Send(command);

        return result.Match(
            order => CreatedAtAction(nameof(GetOrderById), new { OrderId = order.Id }, ToDto(order)),
            Problem
        );
    }

    [HttpPut("{OrderId:guid}/status")]
    public async Task<IActionResult> UpdateOrderStatus(Guid OrderId, UpdateOrderStatusRequest request)
    {
        var command = new UpdateStatusOrderCommand( request.Status,OrderId);
        var result = await _mediator.Send(command);

        return result.Match(
            _ => NoContent(),
            Problem
        );
    }

    [HttpGet("{OrderId:guid}")]
    public async Task<IActionResult> GetOrderById(Guid OrderId)
    {
        var query = new GetOrderByIdQuery(OrderId);
        ErrorOr<Order> result = await _mediator.Send(query);

        return result.Match(
            order => Ok(ToDto(order)),
            Problem
        );
    }

    [HttpGet]
    public async Task<IActionResult> GetAllOrders()
    {
        var query = new GetOrdersQuery();
        ErrorOr<List<Order>> result = await _mediator.Send(query);

        return result.Match(
            orders => Ok(orders.Select(ToDto).ToList()),
            Problem
        );
    }

    [HttpGet("customer/{CustomerId:guid}")]
    public async Task<IActionResult> GetAllOrdersByCustomerId(Guid CustomerId)
    {
        var query = new GetOrderByCustomerIdQuery(CustomerId);
        ErrorOr<List<Order>> result = await _mediator.Send(query);

        return result.Match(
            orders => Ok(orders.ToList()),
            Problem
        );
    }

    [HttpGet("details/{OrderId:guid}")]
    public async Task<IActionResult> GetOrderDetailByOrderId(Guid OrderId)
    {
        var query = new GetOrderDetailByOrderIdQuery(OrderId);
        var result = await _mediator.Send(query);

        return result.Match(
            orderdetails => Ok(orderdetails),
            Problem
        );
    }

    private OrderResponse ToDto(Order order) =>
        new OrderResponse(
            order.Id,
            order.CustomerId,
            order.StoreId,
            order.TotalAmount,
            order.Status,
            order.CreatedAt,
            order.UpdatedAt,
            order.OrderDetails.Select(od => new OrderDetailResponse(od.ProductId, od.Quantity, od.Price)).ToList()
        );
}