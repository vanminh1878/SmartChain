using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Product;

namespace SmartChain.Application.Common.Interfaces;

public interface IProductsRepository
{
    Task AddAsync(Product product, CancellationToken cancellationToken);
    Task<Product?> GetByIdAsync(Guid productId, CancellationToken cancellationToken);
    Task<List<Product>> ListAllAsync(CancellationToken cancellationToken);
    Task<List<Product>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken);
    Task<List<Product>> ListByCategoryIdAsync(Guid categoryId, CancellationToken cancellationToken);
    Task RemoveAsync(Product product, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<Product> products, CancellationToken cancellationToken);
    Task UpdateAsync(Product product, CancellationToken cancellationToken);
}