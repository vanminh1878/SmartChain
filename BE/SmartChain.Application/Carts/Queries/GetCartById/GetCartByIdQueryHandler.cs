using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Queries.GetCartById;

public class GetCartByIdQueryHandler : IRequestHandler<GetCartByIdQuery, ErrorOr<Cart>>
{
    private readonly ICartsRepository _cartsRepository;

    public GetCartByIdQueryHandler(ICartsRepository cartsRepository)
    {
        _cartsRepository = cartsRepository;
    }

    public async Task<ErrorOr<Cart>> Handle(GetCartByIdQuery request, CancellationToken cancellationToken)
    {
        var cart = await _cartsRepository.GetByIdAsync(request.CartId, cancellationToken);
        if (cart is null)
        {
            return Error.NotFound(description: "Cart not found.");
        }

        return cart;
    }
}