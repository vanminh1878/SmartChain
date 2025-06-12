using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Queries.GetOrders;

public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, ErrorOr<List<Order>>>
{
    private readonly IOrderRepository _ordersRepository;

    public GetOrdersQueryHandler(IOrderRepository ordersRepository)
    {
        _ordersRepository = ordersRepository;
    }

    public async Task<ErrorOr<List<Order>>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
    {
        var orders = await _ordersRepository.ListAllAsync(cancellationToken);
        return orders;
    }
}