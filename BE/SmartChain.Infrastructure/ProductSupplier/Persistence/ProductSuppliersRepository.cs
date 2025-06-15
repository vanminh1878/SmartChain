using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.ProductSupplier;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class ProductSuppliersRepository : IProductSuppliersRepository
{
    private readonly AppDbContext _context;

    public ProductSuppliersRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(ProductSupplier productSupplier, CancellationToken cancellationToken)
    {
        await _context.ProductSuppliers.AddAsync(productSupplier, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<ProductSupplier>> GetBySupplierIdAsync(Guid supplierId, CancellationToken cancellationToken)
    {
        return await _context.ProductSuppliers
            .Where(ps => ps.SupplierId == supplierId)
            .ToListAsync(cancellationToken);
    }
}