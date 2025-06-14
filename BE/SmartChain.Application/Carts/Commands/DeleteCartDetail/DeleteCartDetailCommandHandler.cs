using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.CartDetail;


namespace SmartChain.Application.Carts.Commands.DeleteCartDetail;

public class DeleteCartCommandHandler : IRequestHandler<DeleteCartDetailCommand, ErrorOr<Success>>
{
    private readonly ICartsRepository _CartsRepository;
    private readonly ICartDetailsRepository _cartDetailsRepository;

    public DeleteCartCommandHandler(ICartsRepository cartsRepository, ICartDetailsRepository cartDetailsRepository)
    {
        _CartsRepository = cartsRepository;
        _cartDetailsRepository = cartDetailsRepository;
    }

    public async Task<ErrorOr<Success>> Handle(DeleteCartDetailCommand request, CancellationToken cancellationToken)
    {
        var cartDetail = await _cartDetailsRepository.GetByProductIdAsync(request.productId, cancellationToken);
        if (cartDetail is null)
        {
            return Error.NotFound(description: "CartDetail not found.");
        }
        //var cart = await _cartDetailsRepository.GetCartByCartDetailIdAsync(cartDetail.Id, cancellationToken);
        var cart = await _CartsRepository.GetByIdAsync(request.CartId, cancellationToken);
        if (cart is null)
        {
            return Error.NotFound(description: "Cart not found.");
        }

        var result = cart.RemoveCartDetail(cartDetail);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _CartsRepository.UpdateAsync(cart, cancellationToken);
        return Result.Success;
    }
}