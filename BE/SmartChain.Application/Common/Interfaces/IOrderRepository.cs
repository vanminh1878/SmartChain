using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Common.Interfaces;

public interface IOrderRepository
{
    Task AddAsync(Order order, CancellationToken cancellationToken);
    Task<Order?> GetByIdAsync(Guid orderId, CancellationToken cancellationToken);
    Task<List<Order>> ListByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken);
    Task<List<Order>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken);
    Task RemoveAsync(Order order, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<Order> orders, CancellationToken cancellationToken);
    Task UpdateAsync(Order order, CancellationToken cancellationToken);
}