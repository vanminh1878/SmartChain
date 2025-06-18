using ErrorOr;
using MediatR;

namespace SmartChain.Application.StockIntakes.Commands.UpdateStatusStockIntake;

public record UpdateStatusStockIntakeCommand(int newStatus, Guid StockIntakeId) : IRequest<ErrorOr<Success>>;