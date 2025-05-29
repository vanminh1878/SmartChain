using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.StockIntakes.Queries.GetStockIntakeBySupplierId;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Queries.GetStockIntakeByCustomerId;

public class GetStockIntakeByCustomerIdQueryHandler : IRequestHandler<GetStockIntakeBySupplierIdQuery, ErrorOr<List<StockIntake>>>
{
    private readonly IStockIntakesRepository _StockIntakesRepository;

    public GetStockIntakeByCustomerIdQueryHandler(IStockIntakesRepository StockIntakesRepository)
    {
        _StockIntakesRepository = StockIntakesRepository;
    }

    public async Task<ErrorOr<List<StockIntake>>> Handle(GetStockIntakeBySupplierIdQuery request, CancellationToken cancellationToken)
    {
        var StockIntake = await _StockIntakesRepository.ListBySupplierIdAsync(request.supplierId, cancellationToken);
        if (StockIntake is null)
        {
            return Error.NotFound(description: "StockIntake not found.");
        }

        return StockIntake;
    }
}