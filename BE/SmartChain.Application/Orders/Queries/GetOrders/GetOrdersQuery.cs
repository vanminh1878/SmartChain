using ErrorOr;
using MediatR;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Queries.GetOrders;

public record GetOrdersQuery() : IRequest<ErrorOr<List<Order>>>;