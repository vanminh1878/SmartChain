using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.StockIntakeDetails.Commands;


namespace SmartChain.Application.StockIntakeDetails.Commands.CalculateSubtotal;

public class CalculateSubtotalCommandHandler : IRequestHandler<CalculateSubtotalCommand, ErrorOr<decimal>>
{
    private readonly IStockIntakeDetailsRepository _StockIntakeDetailRepository;

    public CalculateSubtotalCommandHandler(IStockIntakeDetailsRepository StockIntakeDetailRepository)
    {
        _StockIntakeDetailRepository = StockIntakeDetailRepository;
    }

    public async Task<ErrorOr<decimal>> Handle(CalculateSubtotalCommand request, CancellationToken cancellationToken)
    {
        var StockIntakeDetail = await _StockIntakeDetailRepository.GetByIdAsync(request.StockIntakeDetailId, cancellationToken);
        if (StockIntakeDetail is null)
        {
            return Error.NotFound(description: "StockIntake Detail not found.");
        }

        var result = StockIntakeDetail.CalculateSubtotal();
        return result;
    }
}