using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakeDetails.Queries;

public class GetStockIntakeDetailQueryHandler : IRequestHandler<GetStockIntakeDetailQuery, ErrorOr<StockIntakeDetail>>
{
    private readonly IStockIntakeDetailsRepository _stockIntakeDetailsRepository;

    public GetStockIntakeDetailQueryHandler(IStockIntakeDetailsRepository stockIntakeDetailsRepository)
    {
        _stockIntakeDetailsRepository = stockIntakeDetailsRepository;
    }

    public async Task<ErrorOr<StockIntakeDetail>> Handle(GetStockIntakeDetailQuery request, CancellationToken cancellationToken)
    {
        var stockIntakeDetail = await _stockIntakeDetailsRepository.GetByIdAsync(request.Id, cancellationToken);
        if (stockIntakeDetail is null)
        {
            return Error.NotFound("Stock intake detail not found.");
        }
        return stockIntakeDetail;
    }
}