using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Commands.ApproveStockIntake;

public class ApproveStockIntakeCommandHandler : IRequestHandler<ApproveStockIntakeCommand, ErrorOr<Success>>
{
    private readonly IStockIntakesRepository _StockIntakesRepository;

    public ApproveStockIntakeCommandHandler(IStockIntakesRepository StockIntakesRepository)
    {
        _StockIntakesRepository = StockIntakesRepository;
    }

    public async Task<ErrorOr<Success>> Handle(ApproveStockIntakeCommand request, CancellationToken cancellationToken)
    {
        var StockIntake = await _StockIntakesRepository.GetByIdAsync(request.StockIntakeId, cancellationToken);
        if (StockIntake is null)
        {
            return Error.NotFound(description: "StockIntake not found.");
        }

        var result = StockIntake.Approve(request.approvedBy);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _StockIntakesRepository.UpdateAsync(StockIntake, cancellationToken);
        return Result.Success;
    }
}