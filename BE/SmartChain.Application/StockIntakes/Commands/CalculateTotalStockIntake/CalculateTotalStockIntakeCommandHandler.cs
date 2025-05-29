using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.Products.Commands.CalculateTotalStockIntake;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Commands.CalculateTotalStockIntake;

public class CalculateTotalStockIntakeCommandHandler : IRequestHandler<CalculateTotalStockIntakeCommand, ErrorOr<decimal>>
{
    private readonly IStockIntakesRepository _StockIntakesRepository;

    public CalculateTotalStockIntakeCommandHandler(IStockIntakesRepository StockIntakesRepository)
    {
        _StockIntakesRepository = StockIntakesRepository;
    }

    public async Task<ErrorOr<decimal>> Handle(CalculateTotalStockIntakeCommand request, CancellationToken cancellationToken)
    {
        var StockIntake = await _StockIntakesRepository.GetByIdAsync(request.StockIntakeId, cancellationToken);
        if (StockIntake is null)
        {
            return Error.NotFound(description: "StockIntake not found.");
        }

        var result = StockIntake.CalculateTotal();
        if (result.IsError)
        {
            return result.Errors;
        }
        return result;
    }
}