using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Application.StockIntakes.Queries.GetPurchaseOrdersForInventory;
using SmartChain.Application.StockIntakes.Queries.GetStockIntakesForInventory;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.Common.Interfaces;

public interface IStockIntakesRepository
{
    Task AddAsync(StockIntake stockIntake, CancellationToken cancellationToken);
    Task<StockIntake?> GetByIdAsync(Guid stockIntakeId, CancellationToken cancellationToken);
    //Task<List<StockIntake>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken);
    Task<List<StockIntake>> ListAllAsync(CancellationToken cancellationToken);
    //Task<List<StockIntake>> ListBySupplierIdAsync(Guid supplierId, CancellationToken cancellationToken);
    Task<List<StockIntake>> ListByCreatedByAsync(Guid createdBy, CancellationToken cancellationToken);
    Task<List<StockIntake>> ListByStatusAsync(int status, CancellationToken cancellationToken);
    Task RemoveAsync(StockIntake stockIntake, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<StockIntake> stockIntakes, CancellationToken cancellationToken);
    Task UpdateAsync(StockIntake stockIntake, CancellationToken cancellationToken);
}