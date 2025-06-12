using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Queries.GetOrderById;

public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, ErrorOr<Order>>
{
    private readonly IOrderRepository _ordersRepository;

    public GetOrderByIdQueryHandler(IOrderRepository ordersRepository)
    {
        _ordersRepository = ordersRepository;
    }

    public async Task<ErrorOr<Order>> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _ordersRepository.GetByIdAsync(request.OrderId, cancellationToken);
        if (order is null)
        {
            return Error.NotFound(description: "Order not found.");
        }

        return order;
    }
}