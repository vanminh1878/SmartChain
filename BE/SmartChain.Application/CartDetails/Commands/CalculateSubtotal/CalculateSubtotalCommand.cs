using ErrorOr;
using MediatR;

namespace SmartChain.Application.CartDetails.Commands.CalculateSubtotal;

public record CalculateSubtotalCommand(Guid CartDetailId) : IRequest<ErrorOr<decimal>>;