using ErrorOr;
using MediatR;

namespace SmartChain.Application.StockIntakes.Commands.DeleteStockIntakeDetail;

public record DeleteStockIntakeDetailCommand(Guid productId, Guid StockIntakeDetailId) : IRequest<ErrorOr<Success>>;