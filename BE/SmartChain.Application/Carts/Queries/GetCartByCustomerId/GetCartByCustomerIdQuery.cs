using ErrorOr;
using MediatR;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Queries.GetCartByCustomerId
{
    public record GetCartByCustomerIdQuery(Guid customerId) : IRequest<ErrorOr<Cart>>;
}