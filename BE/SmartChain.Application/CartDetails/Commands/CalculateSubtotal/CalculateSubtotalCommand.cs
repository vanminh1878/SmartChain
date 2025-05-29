using ErrorOr;
using MediatR;

namespace SmartChain.Application.Products.Commands.CalculateSubtotal;

public record CalculateSubtotalCommand(Guid CartId) : IRequest<ErrorOr<decimal>>;