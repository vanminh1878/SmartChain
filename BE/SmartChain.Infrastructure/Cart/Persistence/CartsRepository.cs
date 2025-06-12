using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Cart;
using SmartChain.Infrastructure.Common.Persistence;


namespace SmartChain.Infrastructure.Persistence.Repositories;

public class CartsRepository : ICartsRepository
{
    private readonly AppDbContext _context;

    public CartsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Cart cart, CancellationToken cancellationToken)
    {
        await _context.Carts.AddAsync(cart, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Cart?> GetByIdAsync(Guid cartId, CancellationToken cancellationToken)
    {
        return await _context.Carts
            .Include(c => c.CartDetails)
            .FirstOrDefaultAsync(c => c.Id == cartId, cancellationToken);
    }

    public async Task<Cart?> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken)
    {
        return await _context.Carts
            .Include(c => c.CartDetails)
            .FirstOrDefaultAsync(c => c.CustomerId == customerId, cancellationToken);
    }
    public async Task<Cart?> GetByCustomerAndStoreAsync(Guid customerId, Guid storeId, CancellationToken cancellationToken)
    {
         return await _context.Carts
            .Include(c => c.CartDetails)
            .FirstOrDefaultAsync(c => c.CustomerId == customerId && c.StoreId == storeId, cancellationToken);
    }

    public async Task<List<Cart>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken)
    {
        return await _context.Carts
            .Where(c => c.StoreId == storeId)
            .ToListAsync(cancellationToken);
    }

    public async Task UpdateAsync(Cart cart, CancellationToken cancellationToken)
    {
        _context.Carts.Update(cart);
        await _context.SaveChangesAsync(cancellationToken);
    }
     public async Task DeleteAsync(Cart cart, CancellationToken cancellationToken)
    {
        _context.Carts.Remove(cart);
        await _context.SaveChangesAsync(cancellationToken);
    }
}