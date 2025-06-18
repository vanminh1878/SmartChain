using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.StockIntake;
using SmartChain.Domain.Product;

namespace SmartChain.Application.StockIntakes.Commands.UpdateStatusStockIntake;

public class UpdateStatusStockIntakeCommandHandler : IRequestHandler<UpdateStatusStockIntakeCommand, ErrorOr<Success>>
{
    private readonly IStockIntakesRepository _stockIntakesRepository;
    private readonly IProductsRepository _productsRepository;

    public UpdateStatusStockIntakeCommandHandler(
        IStockIntakesRepository stockIntakesRepository,
        IProductsRepository productsRepository)
    {
        _stockIntakesRepository = stockIntakesRepository;
        _productsRepository = productsRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateStatusStockIntakeCommand request, CancellationToken cancellationToken)
    {
        var stockIntake = await _stockIntakesRepository.GetByIdAsync(request.StockIntakeId, cancellationToken);
        if (stockIntake is null)
        {
            return Error.NotFound(description: "StockIntake not found.");
        }

        var result = stockIntake.UpdateStatus(request.newStatus);
        if (result.IsError)
        {
            return result.Errors;
        }

        if (request.newStatus == 2) // Intaked
        {
            foreach (var detail in stockIntake.StockIntakeDetails)
            {
                var product = await _productsRepository.GetByIdAsync(detail.ProductId, cancellationToken);
                if (product is null)
                {
                    return Error.NotFound(description: $"Product with ID {detail.ProductId} not found.");
                }

                var updateResult = product.UpdateStockQuantity(detail.Quantity);
                if (updateResult.IsError)
                {
                    return updateResult.Errors;
                }

                await _productsRepository.UpdateAsync(product, cancellationToken);
            }
        }

        await _stockIntakesRepository.UpdateAsync(stockIntake, cancellationToken);
        return Result.Success;
    }
}