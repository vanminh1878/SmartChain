using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Supplier;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.Common.Interfaces;

public interface ISuppliersRepository
{
    Task AddAsync(Supplier supplier, CancellationToken cancellationToken);
    Task<Supplier?> GetByIdAsync(Guid supplierId, CancellationToken cancellationToken);
    Task<Supplier?> GetByEmailAsync(string email, CancellationToken cancellationToken);
     Task<Supplier?> GetByNameAsync(string name, CancellationToken cancellationToken);
    Task<List<Supplier>> ListAllAsync(CancellationToken cancellationToken);
    Task<List<Supplier>> ListByStatusAsync(bool status, CancellationToken cancellationToken);
    Task RemoveAsync(Supplier supplier, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<Supplier> suppliers, CancellationToken cancellationToken);
    Task UpdateAsync(Supplier supplier, CancellationToken cancellationToken);
}