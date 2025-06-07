using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.StockIntake;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class StockIntakeDetailsRepository : IStockIntakeDetailsRepository
{
    private readonly AppDbContext _context;

    public StockIntakeDetailsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(StockIntakeDetail stockIntakeDetail, CancellationToken cancellationToken)
    {
        await _context.StockIntakeDetails.AddAsync(stockIntakeDetail, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<StockIntakeDetail?> GetByIdAsync(Guid stockIntakeDetailId, CancellationToken cancellationToken)
    {
        return await _context.StockIntakeDetails
            .FirstOrDefaultAsync(sid => sid.Id == stockIntakeDetailId, cancellationToken);
    }

    public async Task<List<StockIntakeDetail>> ListByStockIntakeIdAsync(Guid stockIntakeId, CancellationToken cancellationToken)
    {
        return await _context.StockIntakeDetails
            .Where(sid => sid.Id == stockIntakeId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<StockIntakeDetail>> ListByProductIdAsync(Guid productId, CancellationToken cancellationToken)
    {
        return await _context.StockIntakeDetails
            .Where(sid => sid.ProductId == productId)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(StockIntakeDetail stockIntakeDetail, CancellationToken cancellationToken)
    {
        _context.StockIntakeDetails.Remove(stockIntakeDetail);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<StockIntakeDetail> stockIntakeDetails, CancellationToken cancellationToken)
    {
        _context.StockIntakeDetails.RemoveRange(stockIntakeDetails);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(StockIntakeDetail stockIntakeDetail, CancellationToken cancellationToken)
    {
        _context.StockIntakeDetails.Update(stockIntakeDetail);
        await _context.SaveChangesAsync(cancellationToken);
    }
    public async Task<List<StockIntakeDetail>> ListAllAsync(CancellationToken cancellationToken)
    {
        return await _context.StockIntakeDetails
            .ToListAsync(cancellationToken);
    }
}