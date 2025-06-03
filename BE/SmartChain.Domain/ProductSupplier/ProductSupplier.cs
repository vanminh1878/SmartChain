using System;
using ErrorOr;
using SmartChain.Domain.Common;


namespace SmartChain.Domain.ProductSupplier;

public class ProductSupplier : Entity
{
    public Guid ProductId { get; private set; }
    public Guid SupplierId { get; private set; }
    public decimal UnitPrice { get; private set; } // decimal(10,2)
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public ProductSupplier(Guid productId, Guid supplierId, decimal unitPrice, Guid? id = null) : base(id)
    {
        if (productId == Guid.Empty)
        {
            throw new ArgumentException("Product ID cannot be empty.");
        }
        if (supplierId == Guid.Empty)
        {
            throw new ArgumentException("Supplier ID cannot be empty.");
        }
        if (unitPrice < 0)
        {
            throw new ArgumentException("Unit price cannot be negative.");
        }

        ProductId = productId;
        SupplierId = supplierId;
        UnitPrice = unitPrice;
        CreatedAt = DateTime.UtcNow;


    }

    public ErrorOr<Success> Update(decimal unitPrice)
    {
        if (unitPrice < 0)
        {
            return Error.Failure("Unit price cannot be negative.");
        }

        UnitPrice = unitPrice;
        UpdatedAt = DateTime.UtcNow;


        return Result.Success;
    }

    private ProductSupplier() { }
}