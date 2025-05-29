using ErrorOr;
using MediatR;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.StockIntakeDetails.Commands.CreateStockIntakeDetail;

public record CreateStockIntakeDetailCommand(Guid productId, int quantity, decimal unitPrice) : IRequest<ErrorOr<StockIntakeDetail>>;