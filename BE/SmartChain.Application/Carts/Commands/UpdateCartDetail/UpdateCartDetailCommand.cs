using ErrorOr;
using MediatR;

namespace SmartChain.Application.Carts.Commands.UpdateCartDetail;

public record UpdateCartDetailCommand(
    Guid CartId,
    Guid ProductId,
    int Quantity
) : IRequest<ErrorOr<Unit>>;