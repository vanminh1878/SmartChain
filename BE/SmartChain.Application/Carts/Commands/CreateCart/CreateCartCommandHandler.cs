using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Cart;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Carts.Commands.CreateCarts;

public class CreateCartCommandHandler : IRequestHandler<CreateCartCommand, ErrorOr<Cart>>
{
    private readonly ICartsRepository _cartsRepository;
    private readonly IProductsRepository _productsRepository;
    private readonly ICartDetailsRepository _cartDetailsRepository;

    public CreateCartCommandHandler(
        ICartsRepository cartsRepository,
        IProductsRepository productsRepository,
        ICartDetailsRepository cartDetailsRepository)
    {
        _cartsRepository = cartsRepository;
        _productsRepository = productsRepository;
        _cartDetailsRepository = cartDetailsRepository;
    }

    public async Task<ErrorOr<Cart>> Handle(CreateCartCommand request, CancellationToken cancellationToken)
    {
        var product = await _productsRepository.GetByIdAsync(request.ProductId, cancellationToken);
        if (product is null)
        {
            return Error.NotFound(description: $"Product {request.ProductId} not found.");
        }

        if (product.Price is null)
        {
            return Error.Validation(description: $"Product {request.ProductId} does not have a valid price.");
        }

        Guid? customerId = request.CustomerId == Guid.Empty ? null : request.CustomerId;

        var cart = await _cartsRepository.GetByCustomerAndStoreAsync(customerId, request.StoreId, cancellationToken);
        if (cart is null)
        {
            cart = new Cart(customerId, request.StoreId);
            var addResult = await cart.AddCartDetail(request.ProductId, request.Quantity, product.Price.Value);
            if (addResult.IsError)
            {
                return addResult.Errors;
            }
            await _cartsRepository.AddAsync(cart, cancellationToken);
        }
        else
        {// Thực hiện thay đổi trực tiếp trên entity này
            await cart.AddCartDetail(request.ProductId, request.Quantity, product.Price.Value);
            
            await _cartsRepository.UpdateAsync(cart, cancellationToken);
        }

        return cart;
    }
}