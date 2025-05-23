using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Store;

namespace SmartChain.Application.Common.Interfaces;

public interface IStoresRepository
{
    Task AddAsync(Store store, CancellationToken cancellationToken);
    Task<Store?> GetByIdAsync(Guid storeId, CancellationToken cancellationToken);
    Task<Store?> GetByEmailAsync(string email, CancellationToken cancellationToken);
    Task<List<Store>> ListByOwnerIdAsync(Guid ownerId, CancellationToken cancellationToken);
    Task<List<Store>> ListByStatusAsync(bool status, CancellationToken cancellationToken);
    Task RemoveAsync(Store store, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<Store> stores, CancellationToken cancellationToken);
    Task UpdateAsync(Store store, CancellationToken cancellationToken);
}