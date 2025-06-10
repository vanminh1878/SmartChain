using System;
using ErrorOr;
using SmartChain.Domain.Common;
using SmartChain.Domain.StockIntake.Events;

namespace SmartChain.Domain.StockIntake;

public class StockIntakeDetail : Entity
{
    public DateTime IntakeDate { get; private set; }
    public Guid StockIntakeId { get; private set; } // Thêm thuộc tính này
    public Guid SupplierId { get; private set; }
    public Guid ProductId { get; private set; }
    public Guid StoreId { get; private set; }
    public decimal? Profit_margin { get; private set; } // decimal(5,2), default: 0.30
    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public StockIntakeDetail(Guid stockIntakeId,Guid supplierId,Guid storeId, Guid productId, int quantity, decimal unitPrice,DateTime intakeDate, decimal? profitMargin = null, Guid? id = null) : base(id)
    {
        if (intakeDate == DateTime.MinValue)
        {
            throw new ArgumentException("Intake date cannot be empty or invalid.");
        }
        var now = DateTime.UtcNow;
        var minDate = now.AddDays(-20);
        if (intakeDate < minDate || intakeDate > now)
        {
            throw new ArgumentException("Intake date must be between today and 20 days prior.");
        }
        if (stockIntakeId == Guid.Empty)
        {
            throw new ArgumentException("Stock Intake ID cannot be empty.");
        }
        if (supplierId == Guid.Empty)
        {
            throw new ArgumentException("Supplier ID cannot be empty.");
        }
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
        if (profitMargin.HasValue && (profitMargin.Value < 0 || profitMargin.Value > 100))
        {
            throw new ArgumentException("Profit margin must be between 0 and 100.");
        }
        IntakeDate = intakeDate;
        StockIntakeId = stockIntakeId;
        SupplierId = supplierId;
        ProductId = productId;
        Profit_margin = profitMargin ?? 0.30m; // Default: 0.30
        StoreId = storeId;
        Quantity = quantity;
        UnitPrice = unitPrice;
        CreatedAt = DateTime.UtcNow;

        _domainEvents.Add(new StockIntakeDetailCreatedEvent(id ?? Guid.NewGuid(),stockIntakeId,supplierId,storeId, productId, quantity, unitPrice,intakeDate,profitMargin));
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