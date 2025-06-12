using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartChain.Application.Common.Interfaces;
using SmartChain.Domain.Order;
using SmartChain.Infrastructure.Common.Persistence;

namespace SmartChain.Infrastructure.Persistence.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Order order, CancellationToken cancellationToken)
    {
        await _context.Orders.AddAsync(order, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Order?> GetByIdAsync(Guid orderId, CancellationToken cancellationToken)
    {
        return await _context.Orders
            .Include(o => o.OrderDetails)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);
    }

    public async Task<List<Order>> ListByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken)
    {
        return await _context.Orders
            .Where(o => o.CustomerId == customerId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Order>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken)
    {
        return await _context.Orders
            .Where(o => o.StoreId == storeId)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveAsync(Order order, CancellationToken cancellationToken)
    {
        _context.Orders.Remove(order);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRangeAsync(List<Order> orders, CancellationToken cancellationToken)
    {
        _context.Orders.RemoveRange(orders);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Order order, CancellationToken cancellationToken)
    {
        _context.Orders.Update(order);
        await _context.SaveChangesAsync(cancellationToken);
    }
       public async Task<List<Order>> ListAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Orders
            .ToListAsync(cancellationToken);
    }
}