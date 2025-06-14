using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Order;
using SmartChain.Infrastructure.Common.Persistence;
using SmartChain.Infrastructure.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class OrderDetailsRepository : IOrderDetailsRepository
{
    private readonly AppDbContext _context;

    public OrderDetailsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(OrderDetail orderDetail, CancellationToken cancellationToken)
    {
        await _context.OrderDetails.AddAsync(orderDetail, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<OrderDetail?> GetByIdAsync(Guid orderDetailId, CancellationToken cancellationToken)
    {
        return await _context.OrderDetails
            .FirstOrDefaultAsync(od => od.Id == orderDetailId, cancellationToken);
    }

    public async Task<List<OrderDetail>> ListByOrderIdAsync(Guid orderId, CancellationToken cancellationToken)
    {
        return await _context.OrderDetails
            .Where(od => od.OrderId == orderId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<OrderDetail>> ListByProductIdAsync(Guid productId, CancellationToken cancellationToken)
    {
        return await _context.OrderDetails
            .Where(od => od.ProductId == productId)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(OrderDetail orderDetail, CancellationToken cancellationToken)
    {
        _context.OrderDetails.Remove(orderDetail);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<OrderDetail> orderDetails, CancellationToken cancellationToken)
    {
        _context.OrderDetails.RemoveRange(orderDetails);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(OrderDetail orderDetail, CancellationToken cancellationToken)
    {
        _context.OrderDetails.Update(orderDetail);
        await _context.SaveChangesAsync(cancellationToken);
    }
}