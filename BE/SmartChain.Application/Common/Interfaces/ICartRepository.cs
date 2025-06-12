using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Cart;

namespace SmartChain.Application.Common.Interfaces;

public interface ICartsRepository
{
    Task AddAsync(Cart cart, CancellationToken cancellationToken);
    Task<Cart?> GetByIdAsync(Guid cartId, CancellationToken cancellationToken);
    Task<Cart?> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken);
    Task<List<Cart>> ListByStoreIdAsync(Guid storeId, CancellationToken cancellationToken);
    Task UpdateAsync(Cart cart, CancellationToken cancellationToken);
    Task DeleteAsync(Cart cart, CancellationToken cancellationToken);
}