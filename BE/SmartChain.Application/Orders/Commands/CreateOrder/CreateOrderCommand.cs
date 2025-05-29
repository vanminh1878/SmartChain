using ErrorOr;
using MediatR;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Commands.CreateOrder;

public record CreateOrderCommand(Guid customerId, Guid storeId) : IRequest<ErrorOr<Order>>;