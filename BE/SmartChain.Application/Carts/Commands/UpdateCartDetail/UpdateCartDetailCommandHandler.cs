using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;

namespace SmartChain.Application.Carts.Commands.UpdateCartDetail;

public class UpdateCartDetailCommandHandler : IRequestHandler<UpdateCartDetailCommand, ErrorOr<Unit>>
{
    private readonly ICartsRepository _cartsRepository;

    public UpdateCartDetailCommandHandler(ICartsRepository cartsRepository)
    {
        _cartsRepository = cartsRepository;
    }

    public async Task<ErrorOr<Unit>> Handle(UpdateCartDetailCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartsRepository.GetByIdAsync(request.CartId, cancellationToken);
        if (cart is null)
        {
            return Error.NotFound(description: "Cart not found.");
        }

        var result = cart.UpdateCartDetail(request.ProductId, request.Quantity);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _cartsRepository.UpdateAsync(cart, cancellationToken);
        return Unit.Value;
    }
}