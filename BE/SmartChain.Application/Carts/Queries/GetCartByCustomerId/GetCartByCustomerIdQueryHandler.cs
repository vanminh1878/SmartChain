using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.Carts.Queries.GetCartByCustomerId;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Queries.GetCartByCustomerId;

public class GetCartByCustomerIdQueryHandler : IRequestHandler<GetCartByCustomerIdQuery, ErrorOr<Cart>>
{
    private readonly ICartsRepository _CartsRepository;

    public GetCartByCustomerIdQueryHandler(ICartsRepository CartsRepository)
    {
        _CartsRepository = CartsRepository;
    }

    public async Task<ErrorOr<Cart>> Handle(GetCartByCustomerIdQuery request, CancellationToken cancellationToken)
    {
        var Cart = await _CartsRepository.GetByCustomerIdAsync(request.customerId, cancellationToken);
        if (Cart is null)
        {
            return Error.NotFound(description: "Cart not found.");
        }

        return Cart;
    }
}