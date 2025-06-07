using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventory;

// Removed incorrect using directive for namespace-as-type error
using System.Threading;
using System.Threading.Tasks;

namespace SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventoryHandler;

public class GetStockIntakeForInventoryQueryHandler : IRequestHandler<GetStockIntakesForInventoryQuery, ErrorOr<List<StockIntakesForInventoryDto>>>
{
    private readonly IStockIntakesRepository _StockIntakesRepository;

    public GetStockIntakeForInventoryQueryHandler(
        IStockIntakesRepository StockIntakesRepository)
    {
        _StockIntakesRepository = StockIntakesRepository;
    }

    public async Task<ErrorOr<List<StockIntakesForInventoryDto>>> Handle(GetStockIntakesForInventoryQuery request, CancellationToken cancellationToken)
    {
        var StockIntakes = await _StockIntakesRepository.GetStockIntakesForInventoryAsync(request.storeId, cancellationToken);
        if (StockIntakes == null || !StockIntakes.Any())
        {
            return Error.NotFound(description: "Không tìm thấy sản phẩm.");
        }

        return StockIntakes;
    }
}