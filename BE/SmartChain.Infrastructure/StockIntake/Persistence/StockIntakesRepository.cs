using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.StockIntake;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class StockIntakesRepository : IStockIntakesRepository
{
    private readonly AppDbContext _context;

    public StockIntakesRepository(AppDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task AddAsync(StockIntake stockIntake, CancellationToken cancellationToken)
    {
        await _context.StockIntakes.AddAsync(stockIntake ?? throw new ArgumentNullException(nameof(stockIntake)), cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<StockIntake?> GetByIdAsync(Guid stockIntakeId, CancellationToken cancellationToken)
    {
        return await _context.StockIntakes
            .Include(si => si.StockIntakeDetails)
            .FirstOrDefaultAsync(si => si.Id == stockIntakeId, cancellationToken);
    }

    // public async Task<List<StockIntake>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken)
    // {
    //     return await _context.StockIntakes
    //         .Where(si => si.StoreId == storeId)
    //         .ToListAsync(cancellationToken);
    // }

    // public async Task<List<StockIntake>> ListBySupplierIdAsync(Guid supplierId, CancellationToken cancellationToken)
    // {
    //     return await _context.StockIntakes
    //         .Where(si => si.SupplierId == supplierId)
    //         .ToListAsync(cancellationToken);
    // }

    public async Task<List<StockIntake>> ListByCreatedByAsync(Guid createdBy, CancellationToken cancellationToken)
    {
        return await _context.StockIntakes
            .Where(si => si.CreatedBy == createdBy)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<StockIntake>> ListByStatusAsync(int status, CancellationToken cancellationToken)
    {
        return await _context.StockIntakes
            .Where(si => si.Status == status)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(StockIntake stockIntake, CancellationToken cancellationToken)
    {
        _context.StockIntakes.Remove(stockIntake ?? throw new ArgumentNullException(nameof(stockIntake)));
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<StockIntake> stockIntakes, CancellationToken cancellationToken)
    {
        if (stockIntakes == null || !stockIntakes.Any())
            return;

        _context.StockIntakes.RemoveRange(stockIntakes);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(StockIntake stockIntake, CancellationToken cancellationToken)
    {
        _context.StockIntakes.Update(stockIntake ?? throw new ArgumentNullException(nameof(stockIntake)));
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<StockIntake>> ListAllAsync(CancellationToken cancellationToken)
    {
        return await _context.StockIntakes
            .Include(si => si.StockIntakeDetails)
            .ToListAsync(cancellationToken);
    }
}