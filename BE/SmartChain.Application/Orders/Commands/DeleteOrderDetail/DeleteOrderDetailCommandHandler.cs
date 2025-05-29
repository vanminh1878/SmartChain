using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Commands.DeleteOrderDetail;

public class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderDetailCommand, ErrorOr<Success>>
{
    private readonly IOrderRepository _OrdersRepository;

    public DeleteOrderCommandHandler(IOrderRepository OrdersRepository)
    {
        _OrdersRepository = OrdersRepository;
    }

    public async Task<ErrorOr<Success>> Handle(DeleteOrderDetailCommand request, CancellationToken cancellationToken)
    {
        var Order = await _OrdersRepository.GetByIdAsync(request.OrderDetailId, cancellationToken);
        if (Order is null)
        {
            return Error.NotFound(description: "Order not found.");
        }

        var result = Order.RemoveOrderDetail(request.productId);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _OrdersRepository.UpdateAsync(Order, cancellationToken);
        return Result.Success;
    }
}