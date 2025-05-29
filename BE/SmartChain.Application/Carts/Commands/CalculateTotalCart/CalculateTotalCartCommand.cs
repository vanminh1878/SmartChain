using ErrorOr;
using MediatR;

namespace SmartChain.Application.Products.Commands.CalculateTotalCart;

public record CalculateTotalCartCommand(Guid CartId) : IRequest<ErrorOr<decimal>>;