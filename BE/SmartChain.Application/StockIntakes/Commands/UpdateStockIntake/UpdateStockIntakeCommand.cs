using ErrorOr;
using MediatR;

namespace SmartChain.Application.StockIntakes.Commands.UpdateStockIntake;

public record UpdateStockIntakeCommand(Guid productId, int newQuantity, Guid StockIntakeId) : IRequest<ErrorOr<Success>>;