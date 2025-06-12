using ErrorOr;
using MediatR;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Queries.GetOrderById;

public record GetOrderByIdQuery(Guid OrderId) : IRequest<ErrorOr<Order>>;