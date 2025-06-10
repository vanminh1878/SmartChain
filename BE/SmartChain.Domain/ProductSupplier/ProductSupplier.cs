using System;
using ErrorOr;
using SmartChain.Domain.Common;


namespace SmartChain.Domain.ProductSupplier;

public class ProductSupplier : Entity
{
    public Guid ProductId { get; private set; }
    public Guid SupplierId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public ProductSupplier(Guid productId, Guid supplierId, Guid? id = null) : base(id)
    {
        if (productId == Guid.Empty)
        {
            throw new ArgumentException("Product ID cannot be empty.");
        }
        if (supplierId == Guid.Empty)
        {
            throw new ArgumentException("Supplier ID cannot be empty.");
        }


        ProductId = productId;
        SupplierId = supplierId;
        CreatedAt = DateTime.UtcNow;


    }
    private ProductSupplier() { }
}