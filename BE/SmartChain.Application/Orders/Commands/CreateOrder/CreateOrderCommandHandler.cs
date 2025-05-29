using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Orders.Commands.CreateOrder;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, ErrorOr<Order>>
{
    private readonly IOrderRepository _OrdersRepository;

    public CreateOrderCommandHandler(IOrderRepository OrdersRepository)
    {
        _OrdersRepository = OrdersRepository;
    }

    public async Task<ErrorOr<Order>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var Order = new Order(request.customerId, request.storeId);
            await _OrdersRepository.AddAsync(Order, cancellationToken);
            return Order;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}