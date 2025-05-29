using ErrorOr;
using MediatR;

namespace SmartChain.Application.Products.Commands.CalculateTotalOrder;

public record CalculateTotalOrderCommand(Guid OrderId) : IRequest<ErrorOr<decimal>>;