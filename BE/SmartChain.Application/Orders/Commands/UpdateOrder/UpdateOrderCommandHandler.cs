using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Commands.UpdateOrder;

public class UpdateOrderCommandHandler : IRequestHandler<UpdateOrderCommand, ErrorOr<Success>>
{
    private readonly IOrderRepository _OrdersRepository;

    public UpdateOrderCommandHandler(IOrderRepository OrdersRepository)
    {
        _OrdersRepository = OrdersRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
    {
        var Order = await _OrdersRepository.GetByIdAsync(request.OrderId, cancellationToken);
        if (Order is null)
        {
            return Error.NotFound(description: "Order not found.");
        }

        var result = Order.UpdateOrderDetail(request.productId, request.newQuantity);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _OrdersRepository.UpdateAsync(Order, cancellationToken);
        return Result.Success;
    }
}