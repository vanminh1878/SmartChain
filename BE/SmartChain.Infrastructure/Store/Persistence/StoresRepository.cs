using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Store;
using SmartChain.Infrastructure.Common.Persistence;
using SmartChain.Infrastructure.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class StoresRepository : IStoresRepository
{
    private readonly AppDbContext _context;

    public StoresRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Store store, CancellationToken cancellationToken)
    {
        await _context.Stores.AddAsync(store, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Store?> GetByIdAsync(Guid storeId, CancellationToken cancellationToken)
    {
        return await _context.Stores
            .FirstOrDefaultAsync(s => s.Id == storeId, cancellationToken);
    }

    public async Task<Store?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await _context.Stores
            .FirstOrDefaultAsync(s => s.Email == email, cancellationToken);
    }
    public async Task<Store?> GetByNameAsync(string name, CancellationToken cancellationToken)
    {
        return await _context.Stores
            .FirstOrDefaultAsync(s => s.Name == name, cancellationToken);
    }
        public async Task<List<Store>> ListAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Stores
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Store>> ListByOwnerIdAsync(Guid ownerId, CancellationToken cancellationToken)
    {
        return await _context.Stores
            .Where(s => s.OwnerId == ownerId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Store>> ListByStatusAsync(bool status, CancellationToken cancellationToken)
    {
        return await _context.Stores
            .Where(s => s.Status == status)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(Store store, CancellationToken cancellationToken)
    {
        _context.Stores.Remove(store);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<Store> stores, CancellationToken cancellationToken)
    {
        _context.Stores.RemoveRange(stores);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Store store, CancellationToken cancellationToken)
    {
        _context.Stores.Update(store);
        await _context.SaveChangesAsync(cancellationToken);
    }
}