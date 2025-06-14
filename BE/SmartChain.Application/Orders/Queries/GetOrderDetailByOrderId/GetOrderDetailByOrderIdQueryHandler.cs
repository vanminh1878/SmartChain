using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Queries.GetOrderDetailByOrderId;

public class GetOrderDetailByOrderIdQueryHandler : IRequestHandler<GetOrderDetailByOrderIdQuery, ErrorOr<List<OrderDetail>>>
{
    private readonly IOrderRepository _ordersRepository;
    private readonly IOrderDetailsRepository _orderDetailsRepository;

    public GetOrderDetailByOrderIdQueryHandler(IOrderRepository ordersRepository, IOrderDetailsRepository orderDetailsRepository)
    {
        _ordersRepository = ordersRepository;
        _orderDetailsRepository = orderDetailsRepository;
    }

    public async Task<ErrorOr<List<OrderDetail>>> Handle(GetOrderDetailByOrderIdQuery request, CancellationToken cancellationToken)
    {
        var orderdetails = await _orderDetailsRepository.ListByOrderIdAsync(request.OrderId, cancellationToken);
        if (orderdetails is null)
        {
            return Error.NotFound(description: "orderdetails not found.");
        }

        return orderdetails;
    }
}