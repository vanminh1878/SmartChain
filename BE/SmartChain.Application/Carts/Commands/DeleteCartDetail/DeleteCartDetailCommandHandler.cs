using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Commands.DeleteCartDetail;

public class DeleteCartCommandHandler : IRequestHandler<DeleteCartDetailCommand, ErrorOr<Success>>
{
    private readonly ICartsRepository _CartsRepository;

    public DeleteCartCommandHandler(ICartsRepository cartsRepository)
    {
        _CartsRepository = cartsRepository;
    }

    public async Task<ErrorOr<Success>> Handle(DeleteCartDetailCommand request, CancellationToken cancellationToken)
    {
        var Cart = await _CartsRepository.GetByIdAsync(request.CartDetailId, cancellationToken);
        if (Cart is null)
        {
            return Error.NotFound(description: "Cart not found.");
        }

        var result = Cart.RemoveCartDetail(request.productId);
        if (result.IsError)
        {
            return result.Errors;
        }

        await _CartsRepository.UpdateAsync(Cart, cancellationToken);
        return Result.Success;
    }
}