using ErrorOr;
using MediatR;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Commands.CreateCart;

public record CreateCartCommand(Guid customerId, Guid storeId) : IRequest<ErrorOr<Cart>>;