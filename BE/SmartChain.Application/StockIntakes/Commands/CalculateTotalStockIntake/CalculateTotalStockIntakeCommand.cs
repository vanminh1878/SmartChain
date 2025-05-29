using ErrorOr;
using MediatR;

namespace SmartChain.Application.Products.Commands.CalculateTotalStockIntake;

public record CalculateTotalStockIntakeCommand(Guid StockIntakeId) : IRequest<ErrorOr<decimal>>;