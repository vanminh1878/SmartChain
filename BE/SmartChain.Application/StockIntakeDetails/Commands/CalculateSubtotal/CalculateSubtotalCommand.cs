using ErrorOr;
using MediatR;

namespace SmartChain.Application.StockIntakeDetails.Commands.CalculateSubtotal;

public record CalculateSubtotalCommand(Guid StockIntakeDetailId) : IRequest<ErrorOr<decimal>>;