using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Commands.CreateStockIntake;

public class CreateStockIntakeCommandHandler : IRequestHandler<CreateStockIntakeCommand, ErrorOr<StockIntake>>
{
    private readonly IStockIntakesRepository _stockIntakesRepository;

    public CreateStockIntakeCommandHandler(IStockIntakesRepository stockIntakesRepository)
    {
        _stockIntakesRepository = stockIntakesRepository;
    }

    public async Task<ErrorOr<StockIntake>> Handle(CreateStockIntakeCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var stockIntake = new StockIntake(request.CreatedBy);
            await _stockIntakesRepository.AddAsync(stockIntake, cancellationToken);
            return stockIntake;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}