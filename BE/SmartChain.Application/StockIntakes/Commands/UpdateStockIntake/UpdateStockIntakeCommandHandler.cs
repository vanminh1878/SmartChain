using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Commands.UpdateStockIntake;

public class UpdateStockIntakeCommandHandler : IRequestHandler<UpdateStockIntakeCommand, ErrorOr<Success>>
{
    private readonly IStockIntakesRepository _StockIntakesRepository;

    public UpdateStockIntakeCommandHandler(IStockIntakesRepository StockIntakesRepository)
    {
        _StockIntakesRepository = StockIntakesRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateStockIntakeCommand request, CancellationToken cancellationToken)
    {
        var StockIntake = await _StockIntakesRepository.GetByIdAsync(request.StockIntakeId, cancellationToken);
        if (StockIntake is null)
        {
            return Error.NotFound(description: "StockIntake not found.");
        }

        var result = StockIntake.UpdateStockIntakeDetail(request.productId, request.newQuantity);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _StockIntakesRepository.UpdateAsync(StockIntake, cancellationToken);
        return Result.Success;
    }
}