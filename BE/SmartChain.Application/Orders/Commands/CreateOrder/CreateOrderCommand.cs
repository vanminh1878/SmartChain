using ErrorOr;
using MediatR;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Commands.CreateOrder;

public record CreateOrderCommand(
    Guid CustomerId,
    Guid StoreId,
    Guid CartId,
    List<OrderDetailCommand> OrderDetails
) : IRequest<ErrorOr<Order>>;

public record OrderDetailCommand(
    Guid ProductId,
    int Quantity
);