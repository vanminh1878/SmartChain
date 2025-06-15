using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SmartChain.Domain.Customer;

namespace SmartChain.Application.Common.Interfaces;

public interface ICustomersRepository
{
    Task AddAsync(Customer customer, CancellationToken cancellationToken);
    Task<Customer?> GetByIdAsync(Guid customerId, CancellationToken cancellationToken);
    Task<Customer?> GetByEmailAsync(string email, CancellationToken cancellationToken);
    Task<Customer?> GetByAccountIdAsync(Guid accountId, CancellationToken cancellationToken);
    Task<List<Customer>> ListAllAsync(CancellationToken cancellationToken);
    Task<List<Customer>> ListByStatusAsync(bool status, CancellationToken cancellationToken);
    Task RemoveAsync(Customer customer, CancellationToken cancellationToken);
    Task RemoveRangeAsync(List<Customer> customers, CancellationToken cancellationToken);
    Task UpdateAsync(Customer customer, CancellationToken cancellationToken);
}