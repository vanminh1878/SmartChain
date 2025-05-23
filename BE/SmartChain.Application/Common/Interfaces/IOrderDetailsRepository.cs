using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Order;

namespace SmartChain.Application.Common.Interfaces;

public interface IOrderDetailsRepository
{
    Task AddAsync(OrderDetail orderDetail, CancellationToken cancellationToken);
    Task<OrderDetail?> GetByIdAsync(Guid orderDetailId, CancellationToken cancellationToken);
    Task<List<OrderDetail>> ListByOrderIdAsync(Guid orderId, CancellationToken cancellationToken);
    Task<List<OrderDetail>> ListByProductIdAsync(Guid productId, CancellationToken cancellationToken);
    Task RemoveAsync(OrderDetail orderDetail, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<OrderDetail> orderDetails, CancellationToken cancellationToken);
    Task UpdateAsync(OrderDetail orderDetail, CancellationToken cancellationToken);
}