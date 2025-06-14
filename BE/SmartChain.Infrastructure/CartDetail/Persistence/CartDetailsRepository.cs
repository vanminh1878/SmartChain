using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Cart;
using SmartChain.Domain.CartDetail; // Đảm bảo import namespace đúng cho CartDetail
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

    public async Task<Cart?> GetCartByCartDetailIdAsync(Guid cartDetailId, CancellationToken cancellationToken)
    {
        var cartId = await _context.CartDetails
            .Where(cd => cd.Id == cartDetailId)
            .Select(cd => cd.CartId)
            .FirstOrDefaultAsync(cancellationToken);
        var cart = await _context.Carts
            .FirstOrDefaultAsync(c => c.Id == cartId, cancellationToken);
        return cart;
    }

    public async Task<List<CartDetail>> ListByCartIdAsync(Guid cartId, CancellationToken cancellationToken)
    {
        return await _context.CartDetails
            .Where(cd => cd.CartId == cartId) // Sửa cd.Id thành cd.CartId
            .ToListAsync(cancellationToken);
    }

    public async Task<List<CartDetail>> ListByProductIdAsync(Guid productId, CancellationToken cancellationToken)
    {
        return await _context.CartDetails
            .Where(cd => cd.ProductId == productId)
            .ToListAsync(cancellationToken);
    }

    public async Task<CartDetail?> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken)
    {
        return await _context.CartDetails // Sửa để sử dụng async/await
            .FirstOrDefaultAsync(cd => cd.ProductId == productId, cancellationToken);
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

    public async Task RemoveAllByCartIdAsync(Guid cartId, CancellationToken cancellationToken)
    {
        // Lấy tất cả CartDetail có CartId tương ứng
        var cartDetails = await _context.CartDetails
            .Where(cd => cd.CartId == cartId)
            .ToListAsync(cancellationToken);

        // Xóa tất cả CartDetail
        _context.CartDetails.RemoveRange(cartDetails);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(CartDetail cartDetail, CancellationToken cancellationToken)
    {
        _context.CartDetails.Update(cartDetail);
        await _context.SaveChangesAsync(cancellationToken);
    }
}