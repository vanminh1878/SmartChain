using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Carts.Commands.ConvertSelectedToOrder;

public class ConvertSelectedToOrderCommandHandler : IRequestHandler<ConvertSelectedToOrderCommand, ErrorOr<Success>>
{
    private readonly ICartsRepository _CartsRepository;
    private readonly IOrderRepository _OrdersRepository;
    public ConvertSelectedToOrderCommandHandler(ICartsRepository cartsRepository, IOrderRepository ordersRepository)
    {
        _CartsRepository = cartsRepository;
        _OrdersRepository = ordersRepository;
    }

    public async Task<ErrorOr<Success>> Handle(ConvertSelectedToOrderCommand request, CancellationToken cancellationToken)
    {
        var cart = await _CartsRepository.GetByIdAsync(request.CartId, cancellationToken);
        if (cart is null)
        {
            return Error.NotFound(description: "Cart not found.");
        }

        var result = cart.ConvertSelectedToOrder(request.ProductIds, removeFromCart: true);
        if (result.IsError)
        {
            return result.Errors; // Errors đã được chuyển đổi đúng trong ConvertSelectedToOrder
        }

        var order = result.Value;
        await _OrdersRepository.AddAsync(order, cancellationToken);
        await _CartsRepository.UpdateAsync(cart, cancellationToken);

        return Result.Success;
    }
}