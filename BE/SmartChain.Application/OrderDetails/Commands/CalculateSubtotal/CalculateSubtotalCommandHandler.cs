using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.OrderDetails.Commands;


namespace SmartChain.Application.OrderDetails.Commands.CalculateSubtotal;

public class CalculateSubtotalCommandHandler : IRequestHandler<CalculateSubtotalCommand, ErrorOr<decimal>>
{
    private readonly IOrderDetailsRepository _OrderDetailRepository;

    public CalculateSubtotalCommandHandler(IOrderDetailsRepository OrderDetailRepository)
    {
        _OrderDetailRepository = OrderDetailRepository;
    }

    public async Task<ErrorOr<decimal>> Handle(CalculateSubtotalCommand request, CancellationToken cancellationToken)
    {
        var OrderDetail = await _OrderDetailRepository.GetByIdAsync(request.OrderDetailId, cancellationToken);
        if (OrderDetail is null)
        {
            return Error.NotFound(description: "Order Detail not found.");
        }

        var result = OrderDetail.CalculateSubtotal();
        return result;
    }
}