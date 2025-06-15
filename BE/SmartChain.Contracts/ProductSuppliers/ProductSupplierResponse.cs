namespace SmartChain.Contracts.ProductSuppliers;

public record ProductSupplierResponse(
    Guid Id,
    Guid ProductId,
    Guid SupplierId,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);