using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.StockIntake.Events;

namespace SmartChain.Domain.StockIntake;

public class StockIntakeDetail : Entity
{
    public Guid ProductId { get; private set; }
    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public StockIntakeDetail(Guid productId, int quantity, decimal unitPrice, Guid? id = null) : base(id)
    {
        if (productId == Guid.Empty)
        {
            throw new ArgumentException("Product ID cannot be empty.");
        }
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero.");
        }
        if (unitPrice < 0)
        {
            throw new ArgumentException("Unit price cannot be negative.");
        }

        ProductId = productId;
        Quantity = quantity;
        UnitPrice = unitPrice;
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new StockIntakeDetailCreatedEvent(id ?? Guid.NewGuid(), productId, quantity, unitPrice));
    }

    public ErrorOr<Success> UpdateQuantity(int newQuantity)
    {
        if (newQuantity <= 0)
        {
            return Error.Failure("Quantity must be greater than zero.");
        }

        Quantity += newQuantity;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new StockIntakeDetailUpdatedEvent(Id, ProductId, newQuantity, UnitPrice));
        return Result.Success;
    }

    public ErrorOr<Success> UpdateUnitPrice(decimal newUnitPrice)
    {
        if (newUnitPrice < 0)
        {
            return Error.Failure("Unit price cannot be negative.");
        }

        UnitPrice = newUnitPrice;
        UpdatedAt = DateTime.UtcNow;
        _domainEvents.Add(new StockIntakeDetailUpdatedEvent(Id, ProductId, Quantity, newUnitPrice));
        return Result.Success;
    }

    public decimal CalculateSubtotal()
    {
        return Quantity * UnitPrice;
    }
    private StockIntakeDetail() {}
}