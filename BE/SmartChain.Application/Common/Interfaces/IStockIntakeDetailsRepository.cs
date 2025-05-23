using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.StockIntake;

namespace SmartChain.Application.Common.Interfaces;

public interface IStockIntakeDetailsRepository
{
    Task AddAsync(StockIntakeDetail stockIntakeDetail, CancellationToken cancellationToken);
    Task<StockIntakeDetail?> GetByIdAsync(Guid stockIntakeDetailId, CancellationToken cancellationToken);
    Task<List<StockIntakeDetail>> ListByStockIntakeIdAsync(Guid stockIntakeId, CancellationToken cancellationToken);
    Task<List<StockIntakeDetail>> ListByProductIdAsync(Guid productId, CancellationToken cancellationToken);
    Task RemoveAsync(StockIntakeDetail stockIntakeDetail, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<StockIntakeDetail> stockIntakeDetails, CancellationToken cancellationToken);
    Task UpdateAsync(StockIntakeDetail stockIntakeDetail, CancellationToken cancellationToken);
}