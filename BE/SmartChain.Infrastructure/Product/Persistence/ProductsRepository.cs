using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Categories;
using SmartChain.Domain.Product;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class ProductsRepository : IProductsRepository
{
    private readonly AppDbContext _context;

    public ProductsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Product product, CancellationToken cancellationToken)
    {
        await _context.Products.AddAsync(product, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Product?> GetByIdAsync(Guid productId, CancellationToken cancellationToken)
    {
        return await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);
    }
    public async Task<Category> GetCategoryByProductIdAsync(Guid productId, CancellationToken cancellationToken)
    {
        var category = await (from product in _context.Products
                            join cat in _context.Categories
                            on product.CategoryId equals cat.Id
                            where product.Id == productId
                            select cat)
                            .FirstOrDefaultAsync(cancellationToken);

        return category;
    }


    public async Task<List<Product>> ListAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Products
            .ToListAsync(cancellationToken);
    } 
    public async Task<List<Product>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken)
    {
        return await _context.Products
            .Where(p => p.StoreId == storeId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Product>> ListByCategoryIdAsync(Guid categoryId, CancellationToken cancellationToken)
    {
        return await _context.Products
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(Product product, CancellationToken cancellationToken)
    {
        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<Product> products, CancellationToken cancellationToken)
    {
        _context.Products.RemoveRange(products);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Product product, CancellationToken cancellationToken)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync(cancellationToken);
    }
}