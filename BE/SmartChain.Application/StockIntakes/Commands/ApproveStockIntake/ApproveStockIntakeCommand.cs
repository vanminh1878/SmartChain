using ErrorOr;
using MediatR;

namespace SmartChain.Application.StockIntakes.Commands.ApproveStockIntake;

public record ApproveStockIntakeCommand(Guid approvedBy, Guid StockIntakeId) : IRequest<ErrorOr<Success>>;