using ErrorOr;
using MediatR;

namespace SmartChain.Application.OrderDetails.Commands.CalculateSubtotal;

public record CalculateSubtotalCommand(Guid OrderDetailId) : IRequest<ErrorOr<decimal>>;