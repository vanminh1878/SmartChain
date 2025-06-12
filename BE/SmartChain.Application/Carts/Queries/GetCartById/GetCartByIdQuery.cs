using ErrorOr;
using MediatR;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Queries.GetCartById;

public record GetCartByIdQuery(Guid CartId) : IRequest<ErrorOr<Cart>>;