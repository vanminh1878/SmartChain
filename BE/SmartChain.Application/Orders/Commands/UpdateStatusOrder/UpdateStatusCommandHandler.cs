using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Commands.UpdateStatusOrder;

public class UpdateStatusOrderCommandHandler : IRequestHandler<UpdateStatusOrderCommand, ErrorOr<Success>>
{
    private readonly IOrderRepository _OrdersRepository;

    public UpdateStatusOrderCommandHandler(IOrderRepository OrdersRepository)
    {
        _OrdersRepository = OrdersRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateStatusOrderCommand request, CancellationToken cancellationToken)
    {
        var Order = await _OrdersRepository.GetByIdAsync(request.OrderId, cancellationToken);
        if (Order is null)
        {
            return Error.NotFound(description: "Order not found.");
        }

        var result = Order.UpdateStatus(request.newStatus);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _OrdersRepository.UpdateAsync(Order, cancellationToken);
        return Result.Success;
    }
}