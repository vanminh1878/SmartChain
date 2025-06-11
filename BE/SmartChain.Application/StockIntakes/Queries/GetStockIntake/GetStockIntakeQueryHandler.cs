using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Queries.GetStockIntake;

public class GetStockIntakeQueryHandler : IRequestHandler<GetStockIntakeQuery, ErrorOr<List<StockIntake>>>
{
    private readonly IStockIntakesRepository _stockIntakesRepository;

    public GetStockIntakeQueryHandler(IStockIntakesRepository stockIntakesRepository)
    {
        _stockIntakesRepository = stockIntakesRepository;
    }

    public async Task<ErrorOr<List<StockIntake>>> Handle(GetStockIntakeQuery request, CancellationToken cancellationToken)
    {
        var stockIntake = await _stockIntakesRepository.ListAllAsync(cancellationToken);
        if (stockIntake is null)
        {
            return Error.NotFound("Stock intake not found.");
        }
        return stockIntake;
    }
}