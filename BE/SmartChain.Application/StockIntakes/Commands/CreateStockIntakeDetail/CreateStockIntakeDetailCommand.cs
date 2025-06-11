using ErrorOr;
using MediatR;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakeDetails.Commands.CreateStockIntakeDetail;

public record CreateStockIntakeDetailCommand(Guid StockIntakeId,
    Guid ProductId,
    Guid SupplierId,
    Guid StoreId,
    int Quantity,
    decimal UnitPrice,
    DateTime IntakeDate,
    decimal? ProfitMargin = null) : IRequest<ErrorOr<StockIntakeDetail>>;