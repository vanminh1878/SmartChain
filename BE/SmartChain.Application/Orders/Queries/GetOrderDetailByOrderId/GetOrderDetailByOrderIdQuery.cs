using ErrorOr;
using MediatR;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Queries.GetOrderDetailByOrderId;

public record GetOrderDetailByOrderIdQuery(Guid OrderId) : IRequest<ErrorOr<List<OrderDetail>>>;