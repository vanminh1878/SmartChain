using ErrorOr;
using MediatR;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Commands.CreateCarts;

public record CreateCartCommand(
    Guid? CustomerId,
    Guid StoreId,
    Guid ProductId,
    int Quantity
) : IRequest<ErrorOr<Cart>>;