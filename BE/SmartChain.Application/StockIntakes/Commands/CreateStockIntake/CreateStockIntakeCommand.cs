using ErrorOr;
using MediatR;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakes.Commands.CreateStockIntake;

public record CreateStockIntakeCommand(Guid customerId,Guid supplierId, Guid storeId, DateTime intakeDate,Guid createdBy) : IRequest<ErrorOr<StockIntake>>;