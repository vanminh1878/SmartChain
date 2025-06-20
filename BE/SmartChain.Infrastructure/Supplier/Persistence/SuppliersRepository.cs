using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.StockIntake;
using SmartChain.Domain.Supplier;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class SuppliersRepository : ISuppliersRepository
{
    private readonly AppDbContext _context;

    public SuppliersRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Supplier supplier, CancellationToken cancellationToken)
    {
        await _context.Suppliers.AddAsync(supplier, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
   


    public async Task<Supplier?> GetByIdAsync(Guid supplierId, CancellationToken cancellationToken)
    {
        return await _context.Suppliers
            .FirstOrDefaultAsync(s => s.Id == supplierId, cancellationToken);
    }

    public async Task<Supplier?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await _context.Suppliers
            .FirstOrDefaultAsync(s => s.Email == email, cancellationToken);
    }
        public async Task<Supplier?> GetByNameAsync(string name, CancellationToken cancellationToken)
    {
        return await _context.Suppliers
            .FirstOrDefaultAsync(s => s.Name == name, cancellationToken);
    }
    public async Task<List<Supplier>> ListAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Suppliers
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Supplier>> ListByStatusAsync(bool status, CancellationToken cancellationToken)
    {
        return await _context.Suppliers
            .Where(s => s.Status == status)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(Supplier supplier, CancellationToken cancellationToken)
    {
        _context.Suppliers.Remove(supplier);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<Supplier> suppliers, CancellationToken cancellationToken)
    {
        _context.Suppliers.RemoveRange(suppliers);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Supplier supplier, CancellationToken cancellationToken)
    {
        _context.Suppliers.Update(supplier);
        await _context.SaveChangesAsync(cancellationToken);
    }
}