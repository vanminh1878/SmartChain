using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;

namespace SmartChain.Application.Carts.Commands.UpdateCartDetailNewQuantity;

public class UpdateCartDetailNewQuantityCommandHandler : IRequestHandler<UpdateCartDetailNewQuantityCommand, ErrorOr<Unit>>
{
    private readonly ICartsRepository _cartsRepository;

    public UpdateCartDetailNewQuantityCommandHandler(ICartsRepository cartsRepository)
    {
        _cartsRepository = cartsRepository;
    }

    public async Task<ErrorOr<Unit>> Handle(UpdateCartDetailNewQuantityCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartsRepository.GetByIdAsync(request.CartId, cancellationToken);
        if (cart is null)
        {
            return Error.NotFound(description: "Cart not found.");
        }

        var result = cart.UpdateNewQuantityCartDetail(request.ProductId, request.Quantity);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _cartsRepository.UpdateAsync(cart, cancellationToken);
        return Unit.Value;
    }
}