using System;
using System.Collections.Generic;
using System.Linq;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Cart.Events;
using SmartChain.Domain.Order;
using SmartChain.Domain.Order.Events;

namespace SmartChain.Domain.Cart;

public class Cart : Entity
{
    public Guid CustomerId { get; private set; }
    public Guid StoreId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    private readonly List<CartDetail> _cartDetails = new List<CartDetail>();
    public IReadOnlyList<CartDetail> CartDetails => _cartDetails.AsReadOnly();

    public Cart(Guid customerId, Guid storeId, Guid? id = null) : base(id)
    {
        if (customerId == Guid.Empty)
        {
            throw new ArgumentException("Customer ID cannot be empty");
        }
        if (storeId == Guid.Empty)
        {
            throw new ArgumentException("Store ID cannot be empty");
        }
        CustomerId = customerId;
        StoreId = storeId;
        CreatedAt = DateTime.UtcNow;
        _domainEvents.Add(new CartCreatedEvent(id ?? Guid.NewGuid(), customerId, storeId));
    }

    public ErrorOr<Success> AddCartDetail(Guid productId, int quantity, decimal price)
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

        var cartDetail = _cartDetails.FirstOrDefault(cd => cd.ProductId == productId);
        if (cartDetail != null)
        {
            // Update quantity
            cartDetail.UpdateQuantity(cartDetail.Quantity + quantity);
        }
        else
        {
            // Add new CartDetail
            cartDetail = new CartDetail(productId, quantity, price);
            _cartDetails.Add(cartDetail);
        }

        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new CartUpdatedEvent(Id, productId, quantity, price));
        return Result.Success;
    }

    public ErrorOr<Success> UpdateCartDetail(Guid productId, int newQuantity)
    {
        if (newQuantity <= 0)
        {
            return Error.Failure("Quantity must be greater than zero");
        }

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

    public ErrorOr<Success> RemoveCartDetail(Guid productId)
    {
        var cartDetail = _cartDetails.FirstOrDefault(cd => cd.ProductId == productId);
        if (cartDetail == null)
        {
            return Error.NotFound("Product not found in cart");
        }

        _cartDetails.Remove(cartDetail);
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new CartUpdatedEvent(Id, productId, 0, 0));
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

        var order = new Order.Order(CustomerId, StoreId,"pending");
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