using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Commands.UpdateCart;

public class UpdateCartCommandHandler : IRequestHandler<UpdateCartCommand, ErrorOr<Success>>
{
    private readonly ICartsRepository _CartsRepository;

    public UpdateCartCommandHandler(ICartsRepository cartsRepository)
    {
        _CartsRepository = cartsRepository;
    }

    public async Task<ErrorOr<Success>> Handle(UpdateCartCommand request, CancellationToken cancellationToken)
    {
        var Cart = await _CartsRepository.GetByIdAsync(request.CartId, cancellationToken);
        if (Cart is null)
        {
            return Error.NotFound(description: "Cart not found.");
        }

        var result = Cart.UpdateCartDetail(request.productId, request.newQuantity);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _CartsRepository.UpdateAsync(Cart, cancellationToken);
        return Result.Success;
    }
}