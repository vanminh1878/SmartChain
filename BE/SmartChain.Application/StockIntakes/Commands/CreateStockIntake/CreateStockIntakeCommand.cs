using ErrorOr;
using MediatR;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Commands.CreateStockIntake;

public record CreateStockIntakeCommand(Guid CreatedBy) : IRequest<ErrorOr<StockIntake>>;