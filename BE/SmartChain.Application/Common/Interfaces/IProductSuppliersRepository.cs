using SmartChain.Domain.ProductSupplier;

namespace SmartChain.Application.Common.Interfaces;

public interface IProductSuppliersRepository
{
    Task<List<ProductSupplier>> GetBySupplierIdAsync(Guid supplierId, CancellationToken cancellationToken);
    Task AddAsync(ProductSupplier productSupplier, CancellationToken cancellationToken);
     Task<List<ProductSupplier>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken);
}