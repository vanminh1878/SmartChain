using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakeDetails.Commands.CreateStockIntakeDetail;

public class CreateStockIntakeDetailCommandHandler : IRequestHandler<CreateStockIntakeDetailCommand, ErrorOr<StockIntakeDetail>>
{
    private readonly IStockIntakesRepository _stockIntakesRepository;
    private readonly IStockIntakeDetailsRepository _stockIntakeDetailsRepository;

    public CreateStockIntakeDetailCommandHandler(
        IStockIntakesRepository stockIntakesRepository,
        IStockIntakeDetailsRepository stockIntakeDetailsRepository)
    {
        _stockIntakesRepository = stockIntakesRepository;
        _stockIntakeDetailsRepository = stockIntakeDetailsRepository;
    }

    public async Task<ErrorOr<StockIntakeDetail>> Handle(CreateStockIntakeDetailCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Kiểm tra xem StockIntake có tồn tại và đang ở trạng thái pending không
            var stockIntake = await _stockIntakesRepository.GetByIdAsync(request.StockIntakeId, cancellationToken);
            if (stockIntake is null)
            {
                return Error.NotFound("Stock intake not found.");
            }         
            if (stockIntake.Status != 0)
            {
                return Error.Conflict("Cannot add detail to a non-pending stock intake.");
            }

            // Tạo StockIntakeDetail
            var stockIntakeDetail = new StockIntakeDetail(
                request.StockIntakeId,
                request.SupplierId,
                request.StoreId,
                request.ProductId,
                request.Quantity,
                request.UnitPrice,
                request.IntakeDate,
                request.ProfitMargin);

            await _stockIntakeDetailsRepository.AddAsync(stockIntakeDetail, cancellationToken);

            // Cập nhật StockIntake
            var updateResult = stockIntake.AddStockIntakeDetail(
                request.ProductId,
                request.SupplierId,
                request.StoreId,
                request.Quantity,
                request.UnitPrice,
                request.IntakeDate,
                request.ProfitMargin);

            if (updateResult.IsError)
            {
                return updateResult.Errors;
            }

            await _stockIntakesRepository.UpdateAsync(stockIntake, cancellationToken);
            return stockIntakeDetail;
        }
        catch (ArgumentException ex)
        {
            return Error.Failure(description: ex.Message);
        }
    }
}