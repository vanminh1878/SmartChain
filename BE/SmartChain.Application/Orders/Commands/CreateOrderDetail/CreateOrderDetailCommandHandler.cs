using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Order;

namespace SmartChain.Application.OrderDetails.Commands.CreateOrderDetail;

public class CreateOrderDetailCommandHandler : IRequestHandler<CreateOrderDetailCommand, ErrorOr<OrderDetail>>
{
    private readonly IOrderDetailsRepository _OrderDetailsRepository;

    public CreateOrderDetailCommandHandler(IOrderDetailsRepository OrderDetailsRepository)
    {
        _OrderDetailsRepository = OrderDetailsRepository;
    }

    public async Task<ErrorOr<OrderDetail>> Handle(CreateOrderDetailCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var OrderDetail = new OrderDetail(request.productId, request.quantity, request.unitPrice);
            await _OrderDetailsRepository.AddAsync(OrderDetail, cancellationToken);
            return OrderDetail;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}