using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.Cart.Events;

namespace SmartChain.Domain.Cart;

public class CartDetail : Entity
{
    public Guid ProductId { get; private set; }
    public int Quantity { get; private set; }
    public decimal Price { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public CartDetail(Guid productId, int quantity, decimal price, Guid? id = null) : base(id)
    {
        if (productId == Guid.Empty)
        {
            throw new ArgumentException("Product ID cannot be empty.");
        }
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero.");
        }
        if (price < 0)
        {
            throw new ArgumentException("Unit price cannot be negative.");
        }

        ProductId = productId;
        Quantity = quantity;
        Price = price;
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new CartDetailCreatedEvent(id ?? Guid.NewGuid(), productId, quantity, Price));
    }

    public ErrorOr<Success> UpdateQuantity(int newQuantity)
    {
        if (newQuantity <= 0)
        {
            return Error.Failure("Quantity must be greater than zero.");
        }

        Quantity += newQuantity;
        UpdatedAt = DateTime.UtcNow;

        _domainEvents.Add(new CartDetailUpdatedEvent(Id, ProductId, newQuantity, Price));
        return Result.Success;
    }

    public ErrorOr<Success> UpdatePrice(decimal newPrice)
    {
        if (newPrice < 0)
        {
            return Error.Failure("Unit price cannot be negative.");
        }

        Price = newPrice;
        UpdatedAt = DateTime.UtcNow;

        _domainEvents.Add(new CartDetailUpdatedEvent(Id, ProductId, Quantity, newPrice));
        return Result.Success;
    }

    public decimal CalculateSubtotal()
    {
        return Quantity * Price;
    }
    private CartDetail() {}
}