using ErrorOr;
using MediatR;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Order;
using SmartChain.Domain.Product;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Orders.Commands.CreateOrder;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, ErrorOr<Order>>
{
    private readonly IOrderRepository _ordersRepository;
    private readonly IProductsRepository _productsRepository;
    private readonly ICartsRepository _cartsRepository;

    public CreateOrderCommandHandler(
        IOrderRepository ordersRepository,
        IProductsRepository productsRepository,
        ICartsRepository cartsRepository)
    {
        _ordersRepository = ordersRepository;
        _productsRepository = productsRepository;
        _cartsRepository = cartsRepository;
    }

    public async Task<ErrorOr<Order>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // Validate Customer and Store (assumed to be validated in domain or middleware)
        var cart = await _cartsRepository.GetByIdAsync(request.CartId, cancellationToken);
        if (cart is null || cart.CustomerId != request.CustomerId || cart.StoreId != request.StoreId)
        {
            return Error.NotFound(description: "Invalid cart.");
        }

        var orderDetails = new List<OrderDetail>();
        decimal totalAmount = 0;

        foreach (var detail in request.OrderDetails)
        {
            var product = await _productsRepository.GetByIdAsync(detail.ProductId, cancellationToken);
            if (product is null)
            {
                return Error.NotFound(description: $"Product {detail.ProductId} not found.");
            }
            if (product.StockQuantity < detail.Quantity)
            {
                return Error.Conflict(description: $"Insufficient stock for product {product.Name}.");
            }

            if (product.Price == null)
            {
                return Error.Conflict(description: $"Price not set for product {product.Name}.");
            }
            var orderDetail = new OrderDetail(
                product.Id,
                detail.Quantity,
                product.Price.Value
            );
            orderDetails.Add(orderDetail);
            totalAmount += (decimal)product.Price * detail.Quantity;

            // Update stock
            product.UpdateStockQuantity(-detail.Quantity);
            await _productsRepository.UpdateAsync(product, cancellationToken);
        }

            var order = new Order(
            request.CustomerId,
            request.StoreId,
            "Pending",
            orderDetails
        );

       

        await _ordersRepository.AddAsync(order, cancellationToken);
        // await _cartsRepository.DeleteAsync(cart, cancellationToken); // Clear cart after order creation

        return order;
    }
}