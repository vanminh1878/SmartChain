using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Application.Products.Commands.CalculateTotalCart;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Commands.CalculateTotalCart;

public class CalculateTotalCartCommandHandler : IRequestHandler<CalculateTotalCartCommand, ErrorOr<decimal>>
{
    private readonly ICartsRepository _CartsRepository;

    public CalculateTotalCartCommandHandler(ICartsRepository CartsRepository)
    {
        _CartsRepository = CartsRepository;
    }

    public async Task<ErrorOr<decimal>> Handle(CalculateTotalCartCommand request, CancellationToken cancellationToken)
    {
        var Cart = await _CartsRepository.GetByIdAsync(request.CartId, cancellationToken);
        if (Cart is null)
        {
            return Error.NotFound(description: "Cart not found.");
        }

        var result = Cart.CalculateTotal();
        if (result.IsError)
        {
            return result.Errors;
        }
        return result;
    }
}