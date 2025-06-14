using ErrorOr;
using MediatR;

namespace SmartChain.Application.Carts.Commands.UpdateCartDetailNewQuantity;

public record UpdateCartDetailNewQuantityCommand(
    Guid CartId,
    Guid ProductId,
    int Quantity
) : IRequest<ErrorOr<Unit>>;