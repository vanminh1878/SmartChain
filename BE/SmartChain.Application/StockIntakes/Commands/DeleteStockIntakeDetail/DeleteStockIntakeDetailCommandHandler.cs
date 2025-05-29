using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Commands.DeleteStockIntakeDetail;

public class DeleteStockIntakeCommandHandler : IRequestHandler<DeleteStockIntakeDetailCommand, ErrorOr<Success>>
{
    private readonly IStockIntakesRepository _StockIntakesRepository;

    public DeleteStockIntakeCommandHandler(IStockIntakesRepository StockIntakesRepository)
    {
        _StockIntakesRepository = StockIntakesRepository;
    }

    public async Task<ErrorOr<Success>> Handle(DeleteStockIntakeDetailCommand request, CancellationToken cancellationToken)
    {
        var StockIntake = await _StockIntakesRepository.GetByIdAsync(request.StockIntakeDetailId, cancellationToken);
        if (StockIntake is null)
        {
            return Error.NotFound(description: "StockIntake not found.");
        }

        var result = StockIntake.RemoveStockIntakeDetail(request.productId);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _StockIntakesRepository.UpdateAsync(StockIntake, cancellationToken);
        return Result.Success;
    }
}