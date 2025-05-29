using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.Orders.Queries.GetOrderByCustomerId;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Queries.GetOrderByCustomerId;

public class GetOrderByCustomerIdQueryHandler : IRequestHandler<GetOrderByCustomerIdQuery, ErrorOr<List<Order>>>
{
    private readonly IOrderRepository _OrdersRepository;

    public GetOrderByCustomerIdQueryHandler(IOrderRepository OrdersRepository)
    {
        _OrdersRepository = OrdersRepository;
    }

    public async Task<ErrorOr<List<Order>>> Handle(GetOrderByCustomerIdQuery request, CancellationToken cancellationToken)
    {
        var Order = await _OrdersRepository.ListByCustomerIdAsync(request.customerId, cancellationToken);
        if (Order is null)
        {
            return Error.NotFound(description: "Order not found.");
        }

        return Order;
    }
}