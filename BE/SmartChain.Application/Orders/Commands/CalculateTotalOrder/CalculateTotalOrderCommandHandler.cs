using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.Products.Commands.CalculateTotalOrder;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Commands.CalculateTotalOrder;

public class CalculateTotalOrderCommandHandler : IRequestHandler<CalculateTotalOrderCommand, ErrorOr<decimal>>
{
    private readonly IOrderRepository _OrdersRepository;

    public CalculateTotalOrderCommandHandler(IOrderRepository OrdersRepository)
    {
        _OrdersRepository = OrdersRepository;
    }

    public async Task<ErrorOr<decimal>> Handle(CalculateTotalOrderCommand request, CancellationToken cancellationToken)
    {
        var Order = await _OrdersRepository.GetByIdAsync(request.OrderId, cancellationToken);
        if (Order is null)
        {
            return Error.NotFound(description: "Order not found.");
        }

        var result = Order.CalculateTotal();
        if (result.IsError)
        {
            return result.Errors;
        }
        return result;
    }
}