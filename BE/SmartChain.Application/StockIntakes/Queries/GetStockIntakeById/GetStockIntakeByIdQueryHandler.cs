using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Queries.GetStockIntakeById;

public class GetStockIntakeByIdQueryHandler : IRequestHandler<GetStockIntakeByIdQuery, ErrorOr<StockIntake>>
{
    private readonly IStockIntakesRepository _stockIntakesRepository;

    public GetStockIntakeByIdQueryHandler(IStockIntakesRepository stockIntakesRepository)
    {
        _stockIntakesRepository = stockIntakesRepository;
    }

    public async Task<ErrorOr<StockIntake>> Handle(GetStockIntakeByIdQuery request, CancellationToken cancellationToken)
    {
        var stockIntake = await _stockIntakesRepository.GetByIdAsync(request.Id, cancellationToken);
        if (stockIntake is null)
        {
            return Error.NotFound("Stock intake not found.");
        }
        return stockIntake;
    }
}