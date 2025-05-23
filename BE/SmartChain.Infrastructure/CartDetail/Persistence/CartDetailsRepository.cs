using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Cart;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class CartDetailsRepository : ICartDetailsRepository
{
    private readonly AppDbContext _context;

    public CartDetailsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(CartDetail cartDetail, CancellationToken cancellationToken)
    {
        await _context.CartDetails.AddAsync(cartDetail, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<CartDetail?> GetByIdAsync(Guid cartDetailId, CancellationToken cancellationToken)
    {
        return await _context.CartDetails
            .FirstOrDefaultAsync(cd => cd.Id == cartDetailId, cancellationToken);
    }

    public async Task<List<CartDetail>> ListByCartIdAsync(Guid cartId, CancellationToken cancellationToken)
    {
        return await _context.CartDetails
            .Where(cd => cd.Id == cartId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<CartDetail>> ListByProductIdAsync(Guid productId, CancellationToken cancellationToken)
    {
        return await _context.CartDetails
            .Where(cd => cd.ProductId == productId)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(CartDetail cartDetail, CancellationToken cancellationToken)
    {
        _context.CartDetails.Remove(cartDetail);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<CartDetail> cartDetails, CancellationToken cancellationToken)
    {
        _context.CartDetails.RemoveRange(cartDetails);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(CartDetail cartDetail, CancellationToken cancellationToken)
    {
        _context.CartDetails.Update(cartDetail);
        await _context.SaveChangesAsync(cancellationToken);
    }
}