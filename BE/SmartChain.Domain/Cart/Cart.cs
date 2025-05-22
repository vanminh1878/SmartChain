using System;
using System.Collections.Generic;
using System.Linq;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Cart.Events;

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

    public ErrorOr<Success> AddCartDetail(Guid productId, int quantity, decimal unitPrice)
    {
        if (productId == Guid.Empty)
        {
            return Error.Failure("Product ID cannot be empty");
        }
        if (quantity <= 0)
        {
            return Error.Failure("Quantity must be greater than zero");
        }
        if (unitPrice < 0)
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
            cartDetail = new CartDetail(productId, quantity, unitPrice);
            _cartDetails.Add(cartDetail);
        }

        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new CartUpdatedEvent(Id, productId, quantity, unitPrice));
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
        _domainEvents.Add(new CartUpdatedEvent(Id, productId, newQuantity, cartDetail.UnitPrice));
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

        decimal total = _cartDetails.Sum(cd => cd.Quantity * cd.UnitPrice);
        return total;
    }
    private Cart() {}
}