using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Cart;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Carts.Commands.CreateCart;

public class CreateCartCommandHandler : IRequestHandler<CreateCartCommand, ErrorOr<Cart>>
{
    private readonly ICartsRepository _cartsRepository;
    private readonly IProductsRepository _productsRepository;

    public CreateCartCommandHandler(
        ICartsRepository cartsRepository,
        IProductsRepository productsRepository)
    {
        _cartsRepository = cartsRepository;
        _productsRepository = productsRepository;
    }

    public async Task<ErrorOr<Cart>> Handle(CreateCartCommand request, CancellationToken cancellationToken)
    {
        var product = await _productsRepository.GetByIdAsync(request.ProductId, cancellationToken);
        if (product is null)
        {
            return Error.NotFound(description: $"Product {request.ProductId} not found.");
        }

        // Kiểm tra giỏ hàng hiện tại của khách hàng tại cửa hàng
        var cart = await _cartsRepository.GetByCustomerAndStoreAsync(request.CustomerId, request.StoreId, cancellationToken);
        if (cart is null)
        {
            // Tạo giỏ hàng mới nếu chưa có
            cart = new Cart(request.CustomerId, request.StoreId);
            if (product.Price is null)
            {
                return Error.Validation(description: $"Product {request.ProductId} does not have a valid price.");
            }
            var addResult = cart.AddCartDetail(request.ProductId, request.Quantity, product.Price.Value);
            if (addResult.IsError)
            {
                return addResult.Errors;
            }
            await _cartsRepository.AddAsync(cart, cancellationToken);
        }
        else
        {
            // Thêm sản phẩm vào giỏ hàng hiện có
            var addResult = cart.AddCartDetail(request.ProductId, request.Quantity, product.Price.Value);
            if (addResult.IsError)
            {
                return addResult.Errors;
            }
            await _cartsRepository.UpdateAsync(cart, cancellationToken);
        }
        return cart;
    }
}