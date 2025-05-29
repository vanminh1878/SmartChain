using ErrorOr;
using MediatR;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Queries.GetOrderByCustomerId
{
    public record GetOrderByCustomerIdQuery(Guid customerId) : IRequest<ErrorOr<List<Order>>>;
}