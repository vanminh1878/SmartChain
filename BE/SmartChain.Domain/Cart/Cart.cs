using System;
using System.Collections.Generic;
using System.Linq;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Cart.Events;
using SmartChain.Domain.Order;
using SmartChain.Domain.CartDetail;
using SmartChain.Domain.Order.Events;
using System.Threading.Tasks;

namespace SmartChain.Domain.Cart;

public class Cart : Entity
{
    public Guid? CustomerId { get; private set; } // Đổi thành Guid? để hỗ trợ nullable
    public Guid StoreId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    private readonly List<CartDetail.CartDetail> _cartDetails = new List<CartDetail.CartDetail>();
    public IReadOnlyList<CartDetail.CartDetail> CartDetails => _cartDetails.AsReadOnly();
    // public byte[] RowVersion { get; private set; }

    public Cart(Guid? customerId, Guid storeId, Guid? id = null) : base(id)
    {
        if (storeId == Guid.Empty)
        {
            throw new ArgumentException("Store ID cannot be empty");
        }
        CustomerId = customerId; // Cho phép CustomerId là null
        StoreId = storeId;
        CreatedAt = DateTime.UtcNow;
        _domainEvents.Add(new CartCreatedEvent(id ?? Guid.NewGuid(), customerId ?? Guid.Empty, storeId));
    }

    public async Task<ErrorOr<Success>> AddCartDetail(Guid productId, int quantity, decimal price)
    {
        if (productId == Guid.Empty)
        {
            return Error.Failure("Product ID cannot be empty");
        }
        if (quantity <= 0)
        {
            return Error.Failure("Quantity must be greater than zero");
        }
        if (price < 0)
        {
            return Error.Failure("Unit Price cannot be negative");
        }

        var cartDetails = CartDetails.ToList();
        var cartDetail = _cartDetails.FirstOrDefault(cd => cd.ProductId == productId);
        if (cartDetail != null)
        {
            cartDetail.UpdateQuantity(1);
        }
        else
        {
            var newDetail = new CartDetail.CartDetail(this.Id, productId, 1, price);
            Console.WriteLine($"[DEBUG] CartDetail Id: {newDetail.Id}"); // Log ra console
            _cartDetails.Add(newDetail);
            
        }

        UpdatedAt = DateTime.UtcNow;
        //_domainEvents.Add(new CartUpdatedEvent(Id, productId, quantity, price));
        return Result.Success;
    }

    public ErrorOr<Success> UpdateCartDetail(Guid productId, int newQuantity)
    {
       

        var cartDetail = _cartDetails.FirstOrDefault(cd => cd.ProductId == productId);
        if (cartDetail == null)
        {
            return Error.NotFound("Product not found in cart");
        }

        cartDetail.UpdateQuantity(newQuantity);
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new CartUpdatedEvent(Id, productId, newQuantity, cartDetail.Price));
        return Result.Success;
    }

     public ErrorOr<Success> UpdateNewQuantityCartDetail(Guid productId, int newQuantity)
    {
       

        var cartDetail = _cartDetails.FirstOrDefault(cd => cd.ProductId == productId);
        if (cartDetail == null)
        {
            return Error.NotFound("Product not found in cart");
        }

        cartDetail.UpdateNewQuantity(newQuantity);
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new CartUpdatedEvent(Id, productId, newQuantity, cartDetail.Price));
        return Result.Success;
    }

    public ErrorOr<Success> RemoveCartDetail(CartDetail.CartDetail cartDetail)
    {
        // var cartDetail = _cartDetails.FirstOrDefault(cd => cd.ProductId == productId);
        // if (cartDetail == null)
        // {
        //     return Error.NotFound("Product not found in cart");
        // }

        _cartDetails.Remove(cartDetail);
        UpdatedAt = DateTime.UtcNow;

        return Result.Success;
    }

    public ErrorOr<decimal> CalculateTotal()
    {
        if (!_cartDetails.Any())
        {
            return 0m;
        }

        decimal total = _cartDetails.Sum(cd => cd.Quantity * cd.Price);
        return total;
    }

    public ErrorOr<Order.Order> ConvertSelectedToOrder(List<Guid> productIds, bool removeFromCart = true)
    {
        if (productIds == null || !productIds.Any())
        {
            return Error.Failure("No products selected for order");
        }

        var selectedDetails = _cartDetails.Where(cd => productIds.Contains(cd.ProductId)).ToList();
        if (!selectedDetails.Any())
        {
            return Error.NotFound("None of the selected products found in cart");
        }

        var order = new Order.Order(CustomerId ?? Guid.Empty, StoreId, "pending"); // Xử lý CustomerId null
        foreach (var detail in selectedDetails)
        {
            var result = order.AddOrderDetail(detail.ProductId, detail.Quantity, detail.Price);
            if (result.IsError)
            {
                return ErrorOr<Order.Order>.From(result.Errors);
            }
        }

        if (removeFromCart)
        {
            foreach (var detail in selectedDetails)
            {
                _cartDetails.Remove(detail);
            }
            UpdatedAt = DateTime.UtcNow;
            _domainEvents.Add(new CartUpdatedEvent(Id, Guid.Empty, 0, 0));
        }

        return order;
    }

    private Cart() { }
}