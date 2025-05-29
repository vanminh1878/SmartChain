using ErrorOr;
using MediatR;

namespace SmartChain.Application.Carts.Commands.UpdateCart;

public record UpdateCartCommand(Guid productId, int newQuantity, Guid CartId) : IRequest<ErrorOr<Success>>;